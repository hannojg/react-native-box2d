import { Dimensions, Platform, StatusBar } from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const { width: screenWidth, height: _screenHeight } = Dimensions.get('window');
// TODO: probably better to do that with onLayout
const screenHeight =
  Platform.select({
    ios: _screenHeight,
    android:
      // note: my hack of getting the correct screen height on android
      Dimensions.get('screen').height -
      StaticSafeAreaInsets.safeAreaInsetsBottom -
      // only needed bc status bar not translucent!
      (StatusBar.currentHeight ?? 0),
  }) ?? 0;
const widthInMm = 8;
const mmToPxFactor = screenWidth / widthInMm;
const pxToMmFactor = widthInMm / screenWidth;
const heightInMm = screenHeight * pxToMmFactor;
const degreeToRadFactor = Math.PI / 180;

export const Config = {
  widthInMm,
  heightInMm,
  mmToPxFactor,
  pxToMmFactor,
  screenWidth,
  screenHeight,
  degreeToRadFactor,
};
