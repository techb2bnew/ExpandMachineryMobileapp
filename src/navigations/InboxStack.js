import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InboxScreen from '../screens/InboxScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';

const Stack = createNativeStackNavigator();

export default function InboxStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InboxMain" component={InboxScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack.Navigator>
  );
}
