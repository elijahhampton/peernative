import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Main from './components/Main';
import Settings from './pages/Settings';
import Welcome from './pages/Welcome';
import About from './pages/About';

interface IconProps {
  color: string;
  size: number;
}

const Stack = createBottomTabNavigator();

const HomeIcon = ({color, size}: IconProps) => (
  <Icon name="ios-home-outline" color={color} size={size} />
);

const ChatIcon = ({color, size}: IconProps) => (
  <Icon name="ios-chatbubbles-outline" color={color} size={size} />
);

const SettingsIcon = ({color, size}: IconProps) => (
  <Icon name="ios-settings-outline" color={color} size={size} />
);

const AboutIcon = ({color, size}: IconProps) => (
  <Icon name="ios-information-circle-outline" color={color} size={size} />
);

function Navigation(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{tabBarIcon: HomeIcon}}
      />
      <Stack.Screen
        name="Chat"
        component={Main}
        options={{tabBarIcon: ChatIcon}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{tabBarIcon: SettingsIcon}}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{tabBarIcon: AboutIcon}}
      />
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
//       <Stack.Screen name="Chat" component={Main} />
//       <Stack.Screen name="Settings" component={Settings} />
//       <Stack.Screen name="About" component={About} />
//     </Stack.Navigator>
//   );
// }

// export default Navigation;
