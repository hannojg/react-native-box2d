import { Rect } from '@shopify/react-native-skia';
import React from 'react';
import { Box2d } from 'react-native-fast-crypto';
import { BaseActor } from './BaseActor';
import { Config } from '../state/config';
import { addDrawListener, WORLD } from '../state/stage';

type Props = {
  position: Box2d.Common.Math.b2Vec2;
};
export const HEIGHT = 1;
export const WIDTH = 1.5;

// https://github.dev/YieldNull/FlappyBird/blob/master/core/src/com/yieldnull/flappybird/screen/GameScreen.java
export class Bird extends React.PureComponent<Props> {
  private body: Box2d.Dynamics.b2Body;
  private unlisteners?: () => void;

  constructor(props: Props) {
    super(props);

    // Create body
    const bodyDef = Box2d.b2BodyDef();
    bodyDef.type = 2; // b2_dynamicBody
    bodyDef.position = props.position;
    this.body = WORLD.CreateBody(bodyDef);

    const dynamicBox = Box2d.b2PolygonShape();
    dynamicBox.SetAsBox(WIDTH / 2, HEIGHT / 2);
    // fixture
    const fixtureDef = Box2d.b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 0;
    fixtureDef.friction = 0;
    // fixtureDef.isSensor = true;
    this.body.CreateFixture(fixtureDef);
  }

  flyUp = () => {
    // console.log(this.body);
    this.body.SetLinearVelocity(Box2d.b2Vec2(0, -7));
  };

  componentDidMount(): void {
    this.unlisteners = addDrawListener(() => {
      let rotation = this.body.GetAngle();
      if (this.body.GetLinearVelocity().y < -5) {
        rotation -= 6;
      } else {
        rotation += 10;
      }
      // rotation = MathUtils.clamp(rotation, -90, 20);

      const pos = this.body.GetPosition();
      console.log({ pos, rot: rotation * Config.degreeToRadFactor });
      this.body.SetTransform(pos, rotation * Config.degreeToRadFactor);
    });
  }

  componentWillUnmount(): void {
    this.unlisteners?.();
  }

  render(): React.ReactNode {
    return (
      <BaseActor
        width={WIDTH}
        height={HEIGHT}
        body={this.body}
        position={this.props.position}
      >
        <Rect
          x={0}
          y={0}
          width={WIDTH * Config.mmToPxFactor}
          height={HEIGHT * Config.mmToPxFactor}
          color={'yellow'}
        />
      </BaseActor>
    );
  }
}
