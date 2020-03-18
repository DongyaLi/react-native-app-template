import md5 from 'blueimp-md5';
import DeviceInfo from 'react-native-device-info';
import storage from '../storage';
import {Alert, Platform} from 'react-native';
import Config from '../../config';

import {
  INVALID_TGT,
  INVALID_TICKET,
  INVALID_INFO,
  UA_CHANGED,
} from '../../src/constants/errorMessage';
const PKG = require('../../package.json');

const UA = `hawkeye-app-${Platform.OS}-${DeviceInfo.getUniqueId()}`;

const defaultHeaders = {
  'User-Agent': UA,
  'X-Requested-With': 'XMLHttpRequest',
  Accept: 'application/json',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
  version: PKG.version,
  patchVersion: PKG.patchVersion,
};

function buildParams(obj: any) {
  if (!obj) {
    return '';
  }
  var params = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      let value = obj[key] === undefined ? '' : obj[key];
      params.push(`${key}=${value}`);
    }
  }
  return params.join('&');
}

const httpPost = (url: string) => async (param: any) => {
  console.log('defaultHeaders', defaultHeaders);

  const resp = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      'User-Code': '',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: buildParams(param),
  });
  return resp;
};

async function logout(tgt: string) {
  return await fetch(`${Config.CAS_SERVER}/v1/tickets/${tgt}`, {
    method: 'DELETE',
  });
}

// Request a Ticket Granting Ticket
export async function getTGT(
  username: string,
  password: string,
  captcha?: string,
) {
  let data = {};
  if (captcha) {
    data = {
      username,
      password,
      captcha,
    };
  } else {
    data = {
      username,
      password,
    };
  }
  try {
    const resp: any = await httpPost(`${Config.CAS_SERVER}/v1/tickets`)(data);
    console.log('getTGT' + JSON.stringify(resp));
    console.log('getTGT', resp);
    if (resp.status === 201) {
      const location = resp.headers.map.location[0];
      const pieces = location.split('/');
      console.log('TGTres' + pieces[pieces.length - 1]);
      return pieces[pieces.length - 1];
    }
    const message = decodeURIComponent(resp.headers.map.message);
    console.log('errorMessage', message);

    // ua发生变化 需要验证码
    if (resp.headers.map.needsmsvalidate[0] === '1') {
      const e: any = new Error(UA_CHANGED);
      e.respMessage = message;
      throw e;
    } else {
      const e: any = new Error(INVALID_INFO);
      e.respMessage = message;
      throw e;
    }
  } catch (e) {
    const error: any = new Error(UA_CHANGED);
    error.respMessage = '账号或密码错误';
    throw error;
  }
}

// Request a Service Ticket
async function getTicket(service: string, tgt: string, time: number) {
  // 获取ticket，只调用3次
  if (time <= 0) {
    throw new Error(INVALID_TICKET);
  }
  const servicePath = service;
  const resp = await httpPost(`${Config.CAS_SERVER}/v1/tickets/${tgt}`)({
    service: servicePath,
  });
  if (resp && resp.status && resp.status === 200) {
    return resp.text();
  }
  // tgt失效，获取新的tgt
  const result = await storage.getBatchData([
    {key: 'username'},
    {key: 'password'},
  ]);
  tgt = await getTGT(result[0], result[1]);
  return await getTicket(servicePath, tgt, time - 1);
}

// Request a Service Cookie
async function getCookie(service: string, ticket: string) {
  try {
    const servicePath = service;
    const resp = await fetch(`${servicePath}?ticket=${ticket}`);
    console.log(
      'getCookie:' + JSON.stringify(`${service}?ticket=${ticket}`),
      resp,
    );
    if (resp.ok) {
      return true;
    }
    throw new Error(INVALID_TICKET);
  } catch (e) {
    throw new Error(INVALID_TICKET);
  }
}

/**
 * [loginCas 登录cas]
 * @param  {[type]} username [用户名]
 * @param  {[type]} password [密码]
 * @param  {[type]} captcha  [短信验证码，可选]
 * @return {[Promise]}          [description]
 */
export async function loginCas(
  username: string,
  password: string,
  captcha?: string,
) {
  try {
    const tgt = await getTGT(username, password, captcha);
    console.log('tsggssdfsdfs', tgt);

    storage.save({
      key: 'username',
      data: username,
    });
    storage.save({
      key: 'password',
      data: password,
    });
    storage.save({
      key: 'tgt',
      data: tgt,
    });
    storage.save({
      key: 'autoLogin',
      data: true,
    });
    // 获取基础配置信息
    return tgt;
  } catch (error) {
    throw error;
  }
}

/**
 * [logoutCas 登出cas]
 * @return {[Promise]} [description]
 */
export async function logoutCas(clearPassword = false) {
  try {
    const tgt = await storage.load({
      key: 'tgt',
    });
    await logout(tgt);
    storage.save({key: 'autoLogin', data: false});
    if (clearPassword) {
      storage.save({key: 'password', data: ''});
    }
    storage.remove({key: 'tgt'});
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * [getCaptcha 通知后台发送短信验证码]
 * @param  {[type]} username [用户名]
 * @param  {[type]} password [密码]
 * @return {[Promise]}          [description]
 */
export async function getCaptcha(username: string, password: string) {
  password = md5(password);
  const resp = await httpPost(`${Config.CAS_SERVER}/captcha/get`)({
    username,
    password,
  });
  return await resp.json();
}

/**
 * [loginService 登录具体服务]
 * @param  {[String]} service [服务的完整url]
 * @return {[Promise]}         [description]
 */
let retryCount = 0;
export async function loginService(service: string) {
  if (retryCount > 3) {
    retryCount = 0;
    return false;
  }
  console.log('loginService:', arguments);
  let serviceUrl = service;
  if (service === Config.API_SERVERS.BATMAN_BFF) {
    serviceUrl = `${service}auth/cas`;
  }
  try {
    const tgt = await storage.load({key: 'tgt'});
    console.log('tgt>>>>>>>>', tgt);
    // ticket接口获取最多调用3尺
    const ticket = await getTicket(serviceUrl, tgt, 3);
    console.log('ticket...' + JSON.stringify(ticket));
    const result = await getCookie(serviceUrl, ticket);
    console.log('cookie...' + result);
    retryCount = 0;
    return result;
  } catch (error) {
    retryCount++;
    console.log('loginService error', JSON.stringify(error));
    // 获取新的tgt并重新登录
    if (error.message === INVALID_TGT) {
      console.log('error.message === INVALID_TGT');
      try {
        const result = await storage.getBatchData([
          {key: 'username'},
          {key: 'password'},
        ]);
        await loginCas(result[0], result[1]);
        const ret: any = await loginService(serviceUrl);
        return ret;
      } catch (e) {
        Alert.alert('认证失败', 'Ticket错误，请联系管理员');
        retryCount = 999;
        return false;
      }
    }
    if (error.message === INVALID_TICKET) {
      console.log('error.message === INVALID_TICKET');
      Alert.alert('认证失败', 'Ticket错误，请联系管理员');
      retryCount = 999;
      return false;
    }
    if (error.message === UA_CHANGED || error.message === INVALID_INFO) {
      console.log('error.message === UA_CHANGED');
      console.log('errormessage', error);
      let errorText = '';
      if (error.respMessage == '账号或密码错误！') {
        errorText = error.respMessage;
      } else if (error.respMessage.indexOf('账号被锁定') > -1) {
        errorText = '账号已被锁定，请重新设置密码再试';
      } else if (error.respMessage.indexOf('账户不存在') > -1) {
        errorText = error.respMessage;
      } else if (error.respMessage.indexOf('账户被禁用') > -1) {
        errorText = '您的员工工号尚未启用，请联系人力资源部门';
      } else if (error.respMessage.indexOf('忘记密码') > -1) {
        errorText = error.respMessage;
      } else {
        errorText = error.respMessage;
      }
      Alert.alert(errorText);
      retryCount = 999;
      return false;
    }
    console.log('error.message === else');
    retryCount = 999;
    return false;
  }
}

/**
 * [getPasswordCaptcha 找回密码，通知后台发送短信验证码]
 * @param  {[type]} username [用户名]
 * @param  {[type]} channel [手机号 | Email地址]
 * @param  {[type]} way [方式：mobile | email]
 * @return {[Promise]}          [description]
 */
export async function getPasswordCaptcha(
  way: string,
  username: string,
  channel: string,
) {
  const params = {way, username, channel};
  const resp = await httpPost(`${Config.CAS_SERVER}/password/find/captcha`)(
    params,
  );
  return await resp.json();
}

/**
 * [getPasswordCaptcha 找回密码，验证码校验]
 * @param  {[type]} username [用户名]
 * @param  {[type]} channel [手机号 | Email地址]
 * @param  {[type]} way [方式：mobile | email]
 * @param  {[type]} captcha [验证码]
 * @return {[Promise]}          [description]
 */
export async function getPasswordValidate(
  way: string,
  username: string,
  channel: string,
  captcha: string,
) {
  const params = {way, username, channel, captcha};
  const resp = await httpPost(`${Config.CAS_SERVER}/password/find/validate`)(
    params,
  );
  return await resp.json();
}

/**
 * [getPasswordCaptcha 找回密码，重置密码]
 * @param  {[type]} secret [秘钥]
 * @param  {[type]} password [密码]
 * @return {[Promise]}          [description]
 */
export async function resetPassword(secret: string, password: string) {
  const params = {secret, password};
  const resp = await httpPost(`${Config.CAS_SERVER}/password/find/reset`)(
    params,
  );
  return await resp.json();
}
