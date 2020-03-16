import React, {useLayoutEffect} from 'react';
import {Button, View, Text} from 'react-native';

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

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
      <Button title="fetchConstants" onPress={() => actions.fetchConstants()} />
    </View>
  );
}
