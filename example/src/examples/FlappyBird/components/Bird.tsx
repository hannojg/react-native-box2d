import { Rect } from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { Box2d } from 'react-native-fast-crypto';
import { BaseActor } from './BaseActor';
import { Config } from '../state/config';
import { WORLD } from '../state/stage';

type Props = {
  position: Box2d.Common.Math.b2Vec2;
};
export const HEIGHT = 1;
export const WIDTH = 1.5;
export const Bird: React.FC<Props> = ({ position }) => {
  const body = useMemo(() => {
    const bodyDef = Box2d.b2BodyDef();
    bodyDef.type = 2; // b2_dynamicBody
    bodyDef.position = position;
    const _body = WORLD.CreateBody(bodyDef);

    const dynamicBox = Box2d.b2PolygonShape();
    dynamicBox.SetAsBox(WIDTH / 2, HEIGHT / 2);
    // fixture
    const fixtureDef = Box2d.b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 0;
    fixtureDef.friction = 0;
    // fixtureDef.isSensor = true;
    _body.CreateFixture(fixtureDef);

    return _body;
  }, [position]);

  // useEffect(() => {
  //   return () => {
  //     WORLD.DestroyBody(body);
  //   };
  // }, [body]);
  return (
    <BaseActor height={HEIGHT} width={WIDTH} body={body} position={position}>
      <Rect
        x={0}
        y={0}
        width={WIDTH * Config.mmToPxFactor}
        height={HEIGHT * Config.mmToPxFactor}
        color={'yellow'}
      />
    </BaseActor>
  );
};
