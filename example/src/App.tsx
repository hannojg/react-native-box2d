import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { Box2d } from 'react-native-fast-crypto';

export default function App() {
  React.useEffect(() => {
    const world = Box2d.b2World();
    console.log({ world });
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
