import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Main from './components/Main';
import Settings from './pages/Settings';
import Welcome from './pages/Welcome';
import About from './pages/About';

const Stack = createBottomTabNavigator();

function Navigation(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
}

export default Navigation;
