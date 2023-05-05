import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Main from './components/Main';
import Settings from './pages/Settings';
import About from './pages/About';

interface IconProps {
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator();

const ChatIcon = ({ color, size }: IconProps): JSX.Element => (
  <Icon name="ios-chatbubbles-outline" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: IconProps): JSX.Element => (
  <Icon name="ios-settings-outline" color={color} size={size} />
);

const AboutIcon = ({ color, size }: IconProps): JSX.Element => (
  <Icon name="ios-information-circle-outline" color={color} size={size} />
);

const Navigation = (): JSX.Element => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Chat"
        component={Main}
        options={{ tabBarIcon: ChatIcon }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{ tabBarIcon: SettingsIcon }}
      />
      <Tab.Screen
        name="About"
        component={About}
        options={{ tabBarIcon: AboutIcon }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
