import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './tabs/Home';
import FindWC from './tabs/FindWC';
import Navigate from './tabs/Navigate';
import Survey from './tabs/Survey';
import AddWC from './tabs/AddWC';
import WcDetails from './tabs/WcDetails';
import Login from './tabs/Login';
import Register from './tabs/Register';
import Test from './tabs/Test';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={Home}/>
          <Tab.Screen name="FindWC" component={FindWC} />
          <Tab.Screen name="Navigate" component={Navigate} />
          <Tab.Screen name="Survey" component={Survey} />
          <Tab.Screen name="AddWC" component={AddWC} />
          <Tab.Screen name="WcDetails" component={WcDetails} />
          <Tab.Screen name="Test" component={Test} />

        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}