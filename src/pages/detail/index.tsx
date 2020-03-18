import React, {useLayoutEffect} from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import commonStyle from '../../styles/common';
import storage from '../../../libs/storage';
import {loginCas} from '../../../libs/auth';
import detailStore from './store';

interface Props {
  navigation: any;
  route: any;
}

export default function DetailsScreen(props: Props) {
  const [state, actions] = detailStore.useStore();

  useLayoutEffect(() => {
    const {route, navigation} = props;
    const {params} = route;
    const {title} = params || {};
    navigation.setOptions({
      headerTitle: title + state.count,
    });
  }, [props, state.count]);

  console.log('fadsas', props.route.params.title);
  console.log('fadsas', state.constants);

  return (
    <View style={[styles.container, commonStyle.mt40]}>
      <Text>{state.count}</Text>
      <Button title="on plus" onPress={() => actions.onPlus()} />
      <Button title="on moin" onPress={() => actions.onMoin()} />
      <Button
        title="go to detail"
        onPress={() => props.navigation.push('Details', {title: 'detaillll'})}
      />
      <Button
        title="Update the title"
        onPress={() => props.navigation.setOptions({title: 'Updated!'})}
      />
      <Button
        title="setStorage"
        onPress={() => {
          storage.save({
            key: 'username',
            data: '05176',
          });
          storage.save({
            key: 'password',
            data: '123ldy',
          });
        }}
      />
      <Button
        title="getStorage"
        onPress={async () => {
          const res = await storage.load({key: 'username'});
          console.log('gsagsagsad', res);
        }}
      />
      <Button
        title="登录"
        onPress={async () => {
          const res = await storage.getBatchData([
            {key: 'username'},
            {key: 'password'},
          ]);
          console.log('gsagsagsad', res);
          loginCas(res[0], res[1]);
        }}
      />

      <Button title="fetchConstants" onPress={() => actions.fetchConstants()} />
      {state.constants.map((item: {id: number; remark: string}) => (
        <Text key={item.id}>{item.remark}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
