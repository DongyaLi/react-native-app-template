import React, {useEffect} from 'react';
import {Image, BackHandler, Alert, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UserScreen from './src/pages/user';
import HomeScreen from './src/pages/home';
import PageOneScreen from './src/pages/pageOne';
import PageTwoScreen from './src/pages/PageTwo';
import {
  GREY_HOME_ICON,
  GREY_WODE_ICON,
  BLACK_WODE_ICON,
  BLACK_HOME_ICON,
} from './src/images/icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator(props) {
  useEffect(() => {
    const onBackPress = () => {
      let canGoBack = props.navigation.canGoBack();
      if (!canGoBack) {
        Alert.alert('确定退出?', '确定退出鹰眼移动?', [
          {
            text: '取消',
            onPress: () => null,
          },
          {text: '确定', onPress: () => BackHandler.exitApp()},
        ]);
      } else {
        props.navigation.pop();
      }
      return true;
    };
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () =>
      Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [props]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? BLACK_HOME_ICON : GREY_HOME_ICON;
          } else if (route.name === 'User') {
            iconName = focused ? BLACK_WODE_ICON : GREY_WODE_ICON;
          }
          return <Image source={iconName} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#333',
        inactiveTintColor: '#999',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TabScreen" component={TabNavigator} />
        <Stack.Screen name="PageOne" component={PageOneScreen} />
        <Stack.Screen
          name="PageTwo"
          component={PageTwoScreen}
          options={{title: 'come from pagetwo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
