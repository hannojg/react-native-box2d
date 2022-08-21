import React, { useCallback } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ListItem: React.FC<{
  title: string;
  description: string;
  route: string;
}> = ({ title, route, description }) => {
  const navigation = useNavigation();
  const gotoRoute = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: route,
        params: {},
      })
    );
  }, [route, navigation]);
  return (
    <TouchableOpacity onPress={gotoRoute} style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text>👉</Text>
    </TouchableOpacity>
  );
};

const Examples = [
  {
    title: '🟥 Spawn boxes',
    route: 'SpawnBoxes',
    description: 'A simple example of spawning boxes',
  },
  {
    title: '🐦 Flappy bird',
    route: 'FlappyBird',
    description: 'A simple 2D game',
  },
];

export const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      {Examples.map((example) => (
        <ListItem key={example.route} {...example} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    paddingBottom: 4,
    color: 'black',
  },
  description: {
    color: 'black',
  },
});
