import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import FindWC from '../tabs/FindWC';
import AddWC from '../tabs/AddWC';

import WcDetails from '../tabs/WcDetails';
import Navigate from '../tabs/Navigate';
import Survey from '../tabs/Survey';
import Home from '../tabs/Home';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="FindWC" component={FindWC} />
      <Stack.Screen name="WcDetails" component={WcDetails} />
      <Stack.Screen name="Navigate" component={Navigate} />
      <Stack.Screen name="Survey" component={Survey} options={{
        gestureEnabled: false,       // disables swipe back (iOS)
        headerBackVisible: false,    // hides back button (RN v6+)
      }} />
    </Stack.Navigator>
  );
}