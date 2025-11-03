import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../screens/NotificationsScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Auth" component={AuthStack} options={{ gestureEnabled: false }}/>

    </Stack.Navigator>
  );
}
