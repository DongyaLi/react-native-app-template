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
        title="Go to Details"
        onPress={() => props.navigation.navigate('Details', {title: 'detail'})}
      />
    </View>
  );
}
