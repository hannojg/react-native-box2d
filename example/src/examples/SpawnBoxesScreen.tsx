import * as React from 'react';

import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native';
import { b2World, Box2d } from 'react-native-box2d';
import {
  Skia,
  Canvas,
  Group,
  Rect,
  useClockValue,
  useValue,
  useComputedValue,
  useTouchHandler,
} from '@shopify/react-native-skia';
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

const boxSizeMm = 1;
const boxSizePx = Math.ceil(boxSizeMm * mmToPxFactor);

const degreeToRadFactor = Math.PI / 180;

// random int inclusive
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const Box = ({
  world,
  registerStepListener,
}: {
  world: b2World;
  registerStepListener: (listener: () => unknown) => () => void;
}) => {
  const boxWorldPos = useValue({
    y: 4,
    x: randomInt(boxSizeMm, widthInMm - boxSizeMm),
    angle: randomInt(0, 180) * degreeToRadFactor,
  });

  const boxMatrix = useComputedValue(() => {
    const matrix = Skia.Matrix();

    // important, translate first
    matrix.translate(
      boxWorldPos.current.x * mmToPxFactor,
      boxWorldPos.current.y * mmToPxFactor
    );

    // "Transform origin effect" set to center of box
    matrix.translate(boxSizePx / 2, boxSizePx / 2);
    matrix.rotate(boxWorldPos.current.angle);
    matrix.translate(-(boxSizePx / 2), -(boxSizePx / 2));

    return matrix;
  }, [boxWorldPos]);

  React.useEffect(() => {
    // create a dynamic body
    const bodyDef = Box2d.b2BodyDef();
    bodyDef.type = 2; // b2_dynamicBody
    bodyDef.position = Box2d.b2Vec2(
      boxWorldPos.current.x,
      boxWorldPos.current.y
    );
    bodyDef.angle = boxWorldPos.current.angle;

    const body = world.CreateBody(bodyDef);
    // attach
    const dynamicBox = Box2d.b2PolygonShape();
    dynamicBox.SetAsBox(boxSizeMm / 2, boxSizeMm / 2);
    // fixture
    const fixtureDef = Box2d.b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1;
    fixtureDef.friction = 0.3;

    body.CreateFixture(fixtureDef);

    return registerStepListener(() => {
      // update the binding
      const pos = body.GetPosition();
      boxWorldPos.current = {
        x: pos.x,
        y: pos.y,
        angle: body.GetAngle(),
      };
      // console.log(
      //   `x: ${boxWorldPos.current.x.toFixed(
      //     2
      //   )}, y: ${boxWorldPos.current.y.toFixed(
      //     2
      //   )}, rotation: ${boxWorldPos.current.angle.toFixed(2)}`
      // );
    });
  }, [boxWorldPos, registerStepListener, world]);

  return (
    <Group matrix={boxMatrix}>
      <Rect height={boxSizePx} width={boxSizePx} x={0} y={0} color={'red'} />
    </Group>
  );
};

// TODO: the box hits the floor earlier than visible
export const SpawnBoxes = () => {
  const clock = useClockValue();

  /**
   * Important note: the top (y) of thw world is "0", while the bottom is "heightInMm" (e.g. 12)
   */
  console.log(`World in meters:\nWidth: ${widthInMm}\nHeight: ${heightInMm}`);

  const groundBoxHeightMm = 1;
  // Reproduction from: https://box2d.org/documentation/md__d_1__git_hub_box2d_docs_hello.html
  const world = React.useMemo(() => {
    const gravityVec = Box2d.b2Vec2(0, 10); // close to earth gravity
    return Box2d.b2World(gravityVec);
  }, []);

  const stepListeners = React.useRef<(() => unknown)[]>([]);
  React.useEffect(() => {
    // create ground
    const groundBodyDef = Box2d.b2BodyDef();
    groundBodyDef.position = Box2d.b2Vec2(
      widthInMm / 2,
      heightInMm - groundBoxHeightMm
    );
    const groundBody = world.CreateBody(groundBodyDef);
    // ground polygon
    const groundBox = Box2d.b2PolygonShape();
    // The SetAsBox function takes the half-**width** and half-**height** (extents).
    groundBox.SetAsBox(widthInMm, groundBoxHeightMm / 2);
    groundBody.CreateFixture2(groundBox, 0);

    // Start 🙌
    const timeStep = 1 / 60;
    const velocityIterations = 6;
    const positionIterations = 2;

    const remove = clock.addListener(() => {
      // simulate
      world.Step(timeStep, velocityIterations, positionIterations);
      // call listeners (NOTE: i think this call happens on the JS thread)
      stepListeners.current.forEach((listener) => listener());
    });
    clock.start();
    return remove;
  }, [clock, stepListeners, world]);
  const registerStepListener = React.useCallback(
    (listener: () => unknown) => {
      stepListeners.current.push(listener);
      return () => {
        const index = stepListeners.current.indexOf(listener);
        if (index > -1) {
          stepListeners.current.splice(index, 1);
        }
      };
    },
    [stepListeners]
  );

  const [boxCount, setBoxCount] = React.useState(0);
  const touchHandler = useTouchHandler({
    onStart: () => {
      setBoxCount((prev) => prev + 1);
    },
  });

  return (
    <Canvas style={styles.container} onTouch={touchHandler} debug>
      {Array.from({ length: boxCount }).map((_, index) => (
        <Box
          key={index}
          world={world}
          registerStepListener={registerStepListener}
        />
      ))}

      {/* Ground box */}
      <Rect
        height={Math.ceil(mmToPxFactor * groundBoxHeightMm)}
        width={screenWidth}
        x={0}
        y={Math.ceil(screenHeight - groundBoxHeightMm * mmToPxFactor)}
        color={'lightblue'}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
  },
});
