import React from 'react';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {NativeBaseProvider} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  QueryClientProvider,
} from '@tanstack/react-query';
import theme from './theme';
import queryClient from './react-query-index';
import Main from './components/Main';
import { NavigationContainer } from '@react-navigation/native';
import Stack from './navigation'
import Settings from './pages/Settings';
import Welcome from './pages/Welcome';
Icon.loadFont();

function App(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Home" component={Main} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
        </QueryClientProvider>
      </NativeBaseProvider>
    </PaperProvider>
  );
}

export default App;
