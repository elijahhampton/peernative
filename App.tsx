import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClientProvider} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import queryClient from './react-query-index';
import theme from './theme';
import Navigation from './navigation';
import Welcome from './pages/Welcome';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='Welcome' component={Welcome} />
      <Stack.Screen name='App' component={Navigation} />
    </Stack.Navigator>
  )
}

Icon.loadFont();

function Wrapper(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NativeBaseProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <App />
          </NavigationContainer>
        </QueryClientProvider>
      </NativeBaseProvider>
    </PaperProvider>
  );
}

export default Wrapper;
