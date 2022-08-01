import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Box2d } from 'react-native-fast-crypto';

export default function App() {
  React.useEffect(() => {
    const b2vec2 = Box2d.b2Vec2(0, -10);
    const world = Box2d.b2World(b2vec2);

    // create ground
    // const groundBodyDef = B2.b2BodyDef();
    // groundBodyDef.position = B2.b2Vec2(0, -10);
    // const groundBody = world.current.CreateBody(groundBodyDef);
    // // ground polygon
    // const groundBox = B2.b2PolygonShape();
    // groundBox.SetAsBox(50, 10);
    // groundBody.CreateFixture(groundBox, 0);

    // // create a dynamic body
    // const bodyDef = B2.b2BodyDef();
    // bodyDef.type = 2;
    // bodyDef.position = B2.b2Vec2(0, 4);
    // const body = world.current.CreateBody(bodyDef);
    // // attach
    // const dynamicBox = B2.b2PolygonShape();
    // dynamicBox.SetAsBox(1, 1);
    // // fixture
    // const fixtureDef = B2.b2FixtureDef();
    // fixtureDef.shape = dynamicBox;
    // fixtureDef.density = 1;
    // fixtureDef.friction = 0.3;

    // body.CreateFixture(fixtureDef);

    // // Start 🙌
    // const timeStep = 1 / 60;
    // const velocityIterations = 6;
    // const positionIterations = 2;

    // world.Step(timeStep, velocityIterations, positionIterations);
    // for (let i = 0; i < 120 * 10; i++) {
    //   const position = body.GetPosition();
    //   const rotation = body.GetAngle();
    //   console.log(`x: ${position.x}, y: ${position.y}, rotation: ${rotation}`);
    // }

    console.log({ b2vec2, world });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{Box2d == null ? 'Box2d is null :(' : 'Box2d is installed!'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  keys: {
    fontSize: 14,
    color: 'grey',
  },
  title: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginVertical: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
  },
});
