import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelectEquipmentScreen from '../screens/SelectEquipmentScreen';
import IssueDescriptionScreen from '../screens/IssueDescriptionScreen';
import RequestSubmittedScreen from '../screens/RequestSubmittedScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';



const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SelectEquipment" component={SelectEquipmentScreen} />
      <Stack.Screen name="IssueDescription" component={IssueDescriptionScreen} />
      <Stack.Screen name="RequestSubmitted" component={RequestSubmittedScreen} />
      <Stack.Screen name="SupportChat" component={SupportChatScreen} />
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
      <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />


    </Stack.Navigator>
  );
}
