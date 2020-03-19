# APP

## Install yarn
  `yarn install`

## Install pod

  `cd ios && pod install`

### start
  `yarn start`

## Debugging

### Run on simulator
  for ios, first install Xcode.
  for android, first install Android Studio.
  you can use Xcode or Android Studio or use terminal
  
 `react-native run-android` or  `npm run android`
 `react-native run-ios` or `npm run ios`

### Debug

  use the Command + D choose 'Start Remote JS Debugging'
  or look up [here](https://facebook.github.io/react-native/docs/debugging.html)

### Release

  For Android
  * Install APK on devices

   `./gradlew installRelease`

  * Release APK for download

   `./gradlew assembleRelease`
  
  For IOS
  * Xcode: Product->Archive->
