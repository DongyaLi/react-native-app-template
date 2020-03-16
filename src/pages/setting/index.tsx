import * as React from 'react';
import {Button, View, Text} from 'react-native';
interface Props {
  navigation: any;
  route: any;
}
export default function SettingsScreen(props: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Settings Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => props.navigation.navigate('Profile')}
      />
    </View>
  );
}
