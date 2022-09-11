import { Box2d } from 'react-native-box2d';

export const WORLD = Box2d.b2World(Box2d.b2Vec2(0, 20));

const drawListeners: (() => void)[] = [];
export const addDrawListener = (listener: () => void) => {
  drawListeners.push(listener);
  return () => {
    drawListeners.splice(drawListeners.indexOf(listener), 1);
  };
};
export const getDrawListeners = () => drawListeners;
