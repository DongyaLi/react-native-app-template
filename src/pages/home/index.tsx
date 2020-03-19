import * as React from 'react';
import {Button, View, Text} from 'react-native';
interface Props {
  navigation: any;
  route: any;
}
export default function HomeScreen(props: Props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to User"
        onPress={() => props.navigation.navigate('User')}
      />
      <Button
        title="Go to PageOne"
        onPress={() => props.navigation.navigate('PageOne')}
      />
      <Button
        title="Go to PageTwo"
        onPress={() =>
          props.navigation.navigate('PageTwo', {title: 'come from home'})
        }
      />
    </View>
  );
}
