import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { Box2d } from 'react-native-fast-crypto';
import { useClockValue } from '@shopify/react-native-skia';

export default function App() {
  const [v, setV] = React.useState<number>();
  const clock = useClockValue();

  // Reproduction from: https://box2d.org/documentation/md__d_1__git_hub_box2d_docs_hello.html
  React.useEffect(() => {
    const b2vec2 = Box2d.b2Vec2(0, -10);
    const world = Box2d.b2World(b2vec2);

    // create ground
    const groundBodyDef = Box2d.b2BodyDef();
    groundBodyDef.position = Box2d.b2Vec2(0, -10);
    const groundBody = world.CreateBody(groundBodyDef);

    // ground polygon
    const groundBox = Box2d.b2PolygonShape();
    groundBox.SetAsBox(50, 10);
    groundBody.CreateFixture2(groundBox, 0);

    // create a dynamic body
    const bodyDef = Box2d.b2BodyDef();
    bodyDef.type = 2;
    bodyDef.position = Box2d.b2Vec2(0, 4);
    const body = world.CreateBody(bodyDef);
    // attach
    const dynamicBox = Box2d.b2PolygonShape();
    dynamicBox.SetAsBox(1, 1);
    // fixture
    const fixtureDef = Box2d.b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1;
    fixtureDef.friction = 0.3;

    body.CreateFixture(fixtureDef);

    // Start 🙌
    const timeStep = 1 / 60;
    const velocityIterations = 6;
    const positionIterations = 2;

    const remove = clock.addListener(() => {
      world.Step(timeStep, velocityIterations, positionIterations);
      const position = body.GetPosition();
      const rotation = body.GetAngle();
      console.log(
        `x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(
          2
        )}, rotation: ${rotation.toFixed(2)}`
      );
    });
    clock.start();
    return remove;
    // for (let i = 0; i < 60; i++) {
    //   world.Step(timeStep, velocityIterations, positionIterations);
    //   const position = body.GetPosition();
    //   const rotation = body.GetAngle();
    //   console.log(
    //     `#${i} - x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(
    //       2
    //     )}, rotation: ${rotation.toFixed(2)}`
    //   );
    // }
  }, [clock, v]);

  return (
    <View style={styles.container}>
      <Text>{Box2d == null ? 'Box2d is null :(' : 'Box2d is installed!'}</Text>
      <Button title="Re-run useEffect" onPress={() => setV(Date.now())} />
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
