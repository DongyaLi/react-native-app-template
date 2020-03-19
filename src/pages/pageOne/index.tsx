import * as React from 'react';
import {Button, View, Text, StyleSheet} from 'react-native';

interface Props {
  navigation: any;
  route: any;
}
export default function HomeScreen(props: Props) {
  return (
    <View style={styles.container}>
      <Text>PageOne Screen</Text>
      <Button
        title="Go to PageTwo"
        onPress={() =>
          props.navigation.navigate('PageTwo', {title: 'come from PageOne'})
        }
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
