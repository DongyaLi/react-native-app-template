import * as React from 'react';
import {Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/pages/home';
import DetailsScreen from './src/pages/detail';
import ProfileScreen from './src/pages/profile';
import SettingsScreen from './src/pages/setting';
import {
  GREY_HOME_ICON,
  GREY_WODE_ICON,
  BLACK_WODE_ICON,
  BLACK_HOME_ICON,
} from './src/images/icons';

const Tab = createBottomTabNavigator();
const TabHomeStack = createStackNavigator();
const TabSettingsStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconName;
            if (route.name === 'HOME') {
              iconName = focused ? BLACK_HOME_ICON : GREY_HOME_ICON;
            } else if (route.name === 'WODE') {
              iconName = focused ? BLACK_WODE_ICON : GREY_WODE_ICON;
            }
            return <Image source={iconName} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#333',
          inactiveTintColor: '#999',
        }}>
        <Tab.Screen name="HOME">
          {() => (
            <TabHomeStack.Navigator>
              <TabHomeStack.Screen name="Home" component={HomeScreen} />
              <TabHomeStack.Screen
                name="Details"
                component={DetailsScreen}
                options={{title: 'My home'}}
              />
            </TabHomeStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="WODE">
          {() => (
            <TabSettingsStack.Navigator>
              <TabSettingsStack.Screen
                name="Settings"
                component={SettingsScreen}
              />
              <TabSettingsStack.Screen
                name="Profile"
                component={ProfileScreen}
              />
            </TabSettingsStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
