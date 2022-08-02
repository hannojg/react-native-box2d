import {
  Skia,
  Canvas,
  Group,
  Rect,
  useValue,
  runTiming,
  useComputedValue,
} from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { View } from 'react-native';

const CANVAS_SIZE = 200;
const BOX_SIZE = 20;
const BOX_START_X = CANVAS_SIZE / 2 - BOX_SIZE / 2;
const BOX_START_Y = 20;

export default function SimpleRepo() {
  const rotate = useValue(0);
  const posY = useValue(BOX_START_Y);

  useEffect(() => {
    runTiming(rotate, 2 * Math.PI);
    runTiming(posY, CANVAS_SIZE - BOX_SIZE);
  }, [posY, rotate]);

  const boxMatrix = useComputedValue(() => {
    const matrix = Skia.Matrix();
    matrix.translate(BOX_START_X, posY.current);

    matrix.translate(BOX_SIZE / 2, BOX_SIZE / 2);
    matrix.rotate(rotate.current);
    matrix.translate(-(BOX_SIZE / 2), -(BOX_SIZE / 2));

    return matrix;
  }, [rotate, posY]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
        <Rect
          height={CANVAS_SIZE}
          width={CANVAS_SIZE}
          x={0}
          y={0}
          color={'lightgrey'}
        />
        <Group
          matrix={boxMatrix}
          //   origin={{
          //     x: BOX_START_X + BOX_SIZE / 2,
          //     y: BOX_START_Y + BOX_SIZE / 2,
          //   }}
          //   transform={[
          //     {
          //       rotate: rotate.current,
          //     },
          //   ]}
        >
          <Rect y={0} x={0} color={'red'} width={BOX_SIZE} height={BOX_SIZE} />
        </Group>
      </Canvas>
    </View>
  );
}
