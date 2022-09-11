import React, { useEffect } from 'react';
import {
  useValue,
  useComputedValue,
  Skia,
  Group,
} from '@shopify/react-native-skia';
import { Config } from '../state/config';
import { addDrawListener } from '../state/stage';
import type { b2Body, b2Vec2 } from 'react-native-box2d';

type Props = {
  width: number;
  height: number;
  position: b2Vec2;
  body: b2Body;
};

export const BaseActor: React.FC<Props> = ({
  position,
  width,
  height,
  body,
  children,
}) => {
  // binding for rendering
  const boxWorldPos = useValue({
    y: position.y,
    x: position.x,
    angle: 0, // e.g. 45 * degreeToRadFactor,
  });

  const transformMatrix = useComputedValue(() => {
    const matrix = Skia.Matrix();

    // important, translate first
    matrix.translate(
      boxWorldPos.current.x * Config.mmToPxFactor,
      boxWorldPos.current.y * Config.mmToPxFactor
    );

    // Rotate: "Transform origin effect" set to center of the object
    const widthInPx = width * Config.mmToPxFactor;
    const heightInPx = height * Config.mmToPxFactor;
    matrix.translate(-widthInPx / 2, -heightInPx / 2);
    matrix.rotate(boxWorldPos.current.angle);
    matrix.translate(widthInPx / 2, heightInPx / 2);

    return matrix;
  }, [boxWorldPos]);

  useEffect(() => {
    return addDrawListener(() => {
      const pos = body.GetPosition();
      boxWorldPos.current = {
        x: pos.x,
        y: pos.y,
        angle: body.GetAngle(),
      };
    });
  }, [body, boxWorldPos]);

  return <Group matrix={transformMatrix}>{children}</Group>;
};
