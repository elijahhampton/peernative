import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Main from './components/Main';
import Settings from './pages/Settings';
import Welcome from './pages/Welcome';
import About from './pages/About';

const Stack = createBottomTabNavigator();

function Navigation(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'About') {
            iconName = focused
              ? 'information-circle'
              : 'information-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
}

export default Navigation;

// import React from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// import Main from './components/Main';
// import Settings from './pages/Settings';
// import Welcome from './pages/Welcome';
// import About from './pages/About';

// const Stack = createBottomTabNavigator();

// function Navigation(): JSX.Element {
//   return (
//     <Stack.Navigator screenOptions={{headerShown: false}}>
//       <Stack.Screen name="Welcome" component={Welcome} />
//       <Stack.Screen name="Home" component={Main} />
//       <Stack.Screen name="Settings" component={Settings} />
//       <Stack.Screen name="About" component={About} />
//     </Stack.Navigator>
//   );
// }

// export default Navigation;
