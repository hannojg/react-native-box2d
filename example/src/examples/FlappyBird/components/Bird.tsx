import { Rect } from '@shopify/react-native-skia';
import React from 'react';
import { b2Body, b2Vec2, Box2d } from 'react-native-box2d';
import { BaseActor } from './BaseActor';
import { Config } from '../state/config';
import { addDrawListener, WORLD } from '../state/stage';

type Props = {
  position: b2Vec2;
};
export const HEIGHT = 1;
export const WIDTH = 1.5;

// https://github.dev/YieldNull/FlappyBird/blob/master/core/src/com/yieldnull/flappybird/screen/GameScreen.java
export class Bird extends React.PureComponent<Props> {
  private body: b2Body;

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
    fixtureDef.density = 0.1;
    fixtureDef.friction = 1;
    // fixtureDef.isSensor = true;
    this.body.CreateFixture(fixtureDef);
  }

  flyUp = () => {
    this.body.SetLinearVelocity(Box2d.b2Vec2(0, -10));
  };

  private unlistener?: () => void;
  componentDidMount(): void {
    // TODO: change rotation
    this.unlistener = addDrawListener(() => {
      console.log(this.body.GetLinearVelocity());
    });
  }

  componentWillUnmount(): void {
    this.unlistener?.();
    WORLD.DestroyBody(this.body);
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
