import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../tabs/Home';
import FindWC from '../tabs/FindWC';
import Login from '../tabs/Login';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FindWC" component={FindWC} />
      <Tab.Screen name="Logout" component={Login} />
    </Tab.Navigator>
  );
}

