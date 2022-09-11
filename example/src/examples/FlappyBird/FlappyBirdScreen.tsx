import {
  Canvas,
  useClockValue,
  useTouchHandler,
} from '@shopify/react-native-skia';
import React, { useEffect, useMemo, useRef } from 'react';
import { StatusBar } from 'react-native';
import { Box2d } from 'react-native-box2d';
import { WIDTH, HEIGHT, Bird } from './components/Bird';
import { Config } from './state/config';
import { getDrawListeners, WORLD } from './state/stage';

const STEP_TIME = 1 / 60;
const VELOCITY_ITERATIONS = 6;
const POSITION_ITERATIONS = 2;

export const FlappyBirdScreen = () => {
  const birdRef = useRef<Bird>(null);
  const birdPosition = useMemo(() => {
    return Box2d.b2Vec2(
      Config.widthInMm / 2 - WIDTH / 2,
      Config.heightInMm / 2 - HEIGHT / 2
    );
  }, []);

  // Simulate world
  const clock = useClockValue();
  const accumulator = useRef(0);
  useEffect(() => {
    return clock.addListener((delta) => {
      accumulator.current += delta;
      if (accumulator.current >= STEP_TIME) {
        accumulator.current -= STEP_TIME;
        WORLD.Step(STEP_TIME, VELOCITY_ITERATIONS, POSITION_ITERATIONS);

        getDrawListeners().forEach((listener) => {
          listener();
        });
      }
    });
  }, [clock]);

  // Hide status bar
  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false);
    };
  }, []);

  const onTouch = useTouchHandler({
    onStart: () => {
      birdRef.current?.flyUp();
    },
  });

  return (
    <Canvas
      style={{
        height: Config.screenHeight,
        width: Config.screenWidth,
      }}
      onTouch={onTouch}
    >
      <Bird ref={birdRef} position={birdPosition} />
    </Canvas>
  );
};
