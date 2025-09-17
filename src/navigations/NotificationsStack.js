import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationsMain" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
