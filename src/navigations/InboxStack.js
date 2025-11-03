import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from '../screens/InboxScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function InboxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InboxMain" component={InboxScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Auth" component={AuthStack} options={{ gestureEnabled: false }}/>

    </Stack.Navigator>
  );
}
