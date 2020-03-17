import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const Colors = {
  MAIN: '#FF8300',
  ORANGE: '#ff9f5e',
  GREEN: '#95d38c',
  BLUE: '#80affd',
  RED: '#fb6668',
};
export default StyleSheet.create({
  mt40: {
    marginTop: 40,
  },

  // example
  page: {
    width,
    height,
  },
  background: {
    backgroundColor: Colors.MAIN,
  },
});
