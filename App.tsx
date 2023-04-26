import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import {Provider as PaperProvider} from 'react-native-paper';
import {QueryClientProvider} from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/Ionicons';

import queryClient from './react-query-index';
import theme from './theme';
import Navigation from './navigation';

Icon.loadFont();

function App(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NativeBaseProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </QueryClientProvider>
      </NativeBaseProvider>
    </PaperProvider>
  );
}

export default App;
