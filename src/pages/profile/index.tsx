import * as React from 'react';
import {Button, View, Text, Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  navigation: any;
  route: any;
}

export default function ProfileScreen(props: Props) {
  useFocusEffect(
    React.useCallback(() => {
      Alert.alert('Screen was focused');
      // Do something when the screen is focused
      return () => {
        Alert.alert('Screen was unfocused');
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Profile Screen</Text>
      <Button
        title="Go to Settings"
        onPress={() => props.navigation.navigate('Settings')}
      />
    </View>
  );
}
