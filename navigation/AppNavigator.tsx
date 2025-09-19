import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../tabs/Home';
import FindWC from '../tabs/FindWC';
import AddWC from '../tabs/AddWC';
import Login from '../tabs/Login';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Find Washroom" component={FindWC} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Add Washroom" component={AddWC} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name="Logout" component={Login} options={{
        tabBarStyle: { display: "none" },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="log-out-outline" color={color} size={size} />
        ),
      }} />
    </Tab.Navigator>
  );
}

