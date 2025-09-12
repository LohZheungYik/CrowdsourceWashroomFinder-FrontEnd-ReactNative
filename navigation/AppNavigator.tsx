import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import FindWC from '../tabs/FindWC';
import WcDetails from '../tabs/WcDetails';
import Navigate from '../tabs/Navigate';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FindWC" component={FindWC} />
      <Stack.Screen name="WcDetails" component={WcDetails} />
      <Stack.Screen name="Navigate" component={Navigate} />
    
    </Stack.Navigator>
  );
}