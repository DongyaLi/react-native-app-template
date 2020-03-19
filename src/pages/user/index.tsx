import * as React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  navigation: any;
  route: any;
}

export default function ProfileScreen(props: Props) {
  useFocusEffect(
    React.useCallback(() => {
      // Alert.alert('Screen was focused');
      return () => {
        // Alert.alert('Screen was unfocused');
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text>User Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => props.navigation.navigate('Home')}
      />
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
