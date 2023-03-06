import { NativeModules, Platform } from 'react-native';
import type {
  b2BodyDef,
  b2CircleShape,
  b2FixtureDef,
  b2PolygonShape,
  b2Vec2,
  b2World,
} from './types';

// global func declaration for JSI functions
declare global {
  function nativeCallSyncHook(): unknown;

  var Box2dApi:
    | undefined
    | {
        b2Vec2: (xIn: number, yIn: number) => b2Vec2;
        b2World: (vec: b2Vec2) => b2World;
        b2BodyDef: () => b2BodyDef;
        b2PolygonShape: () => b2PolygonShape;
        b2CircleShape: () => b2CircleShape;
        b2FixtureDef: () => b2FixtureDef;
      };
}

// Check if the constructor exists. If not, try installing the JSI bindings.
if (global.Box2dApi == null) {
  // Get the native Box2d ReactModule
  const Box2dModule = NativeModules.Box2d;
  if (Box2dModule == null) {
    let message =
      'Failed to install react-native-box2d: The native `Box2d` Module could not be found.';
    message +=
      '\n* Make sure react-native-box2d is correctly autolinked (run `npx react-native config` to verify)';
    if (Platform.OS === 'ios' || Platform.OS === 'macos') {
      message += '\n* Make sure you ran `pod install` in the ios/ directory.';
    }
    if (Platform.OS === 'android') {
      message += '\n* Make sure gradle is synced.';
    }
    // check if Expo
    const ExpoConstants =
      NativeModules.NativeUnimoduleProxy?.modulesConstants?.ExponentConstants;
    if (ExpoConstants != null) {
      if (ExpoConstants.appOwnership === 'expo') {
        // We're running Expo Go
        throw new Error(
          'react-native-box2d is not supported in Expo Go! Use EAS (`expo prebuild`) or eject to a bare workflow instead.'
        );
      } else {
        // We're running Expo bare / standalone
        message += '\n* Make sure you ran `expo prebuild`.';
      }
    }

    message += '\n* Make sure you rebuilt the app.';
    throw new Error(message);
  }

  // Check if we are running on-device (JSI)
  if (global.nativeCallSyncHook == null || Box2dModule.install == null) {
    throw new Error(
      'Failed to install react-native-box2d: React Native is not running on-device. Box2d can only be used when synchronous method invocations (JSI) are possible. If you are using a remote debugger (e.g. Chrome), switch to an on-device debugger (e.g. Flipper) instead.'
    );
  }

  // Call the synchronous blocking install() function
  const result = Box2dModule.install();
  if (result !== true)
    throw new Error(
      `Failed to install react-native-box2d: The native Box2d Module could not be installed! Looks like something went wrong when installing JSI bindings: ${result}`
    );

  // Check again if the constructor now exists. If not, throw an error.
  if (global.Box2dApi == null)
    throw new Error(
      'Failed to install react-native-box2d, the native initializer function does not exist. Are you trying to use Box2d from different JS Runtimes?'
    );
}

export const Box2d = global.Box2dApi;
