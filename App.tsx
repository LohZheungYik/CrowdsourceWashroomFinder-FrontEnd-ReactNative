import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Navigate from './tabs/Navigate';
import Survey from './tabs/Survey';
import AddWC from './tabs/AddWC';
import WcDetails from './tabs/WcDetails';
import Register from './tabs/Register';
import FindWC from './tabs/FindWC';

import {MainTabs} from './navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Tabs as the main entry */}
          <Stack.Screen name="Tabs" component={MainTabs} />

          {/* Stack-only screens (not shown in tab bar) */}
          {/* <Stack.Screen name="FindWC" component={FindWC} /> */}
          <Stack.Screen name="WcDetails" component={WcDetails} />
          <Stack.Screen name="Navigate" component={Navigate} />
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="AddWC" component={AddWC} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
