import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Tabs" component={BottomTabs} options={{ gestureEnabled: false }}/>  
    </Stack.Navigator>
  );
}
