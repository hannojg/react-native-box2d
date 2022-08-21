import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './HomeScreen';
import { SpawnBoxes } from './examples/SpawnBoxesScreen';
import { FlappyBirdScreen } from './examples/FlappyBird/FlappyBirdScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="SpawnBoxes" component={SpawnBoxes} />
          <Stack.Screen name="FlappyBird" component={FlappyBirdScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
