import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelectEquipmentScreen from '../screens/SelectEquipmentScreen';
import IssueDescriptionScreen from '../screens/IssueDescriptionScreen';
import RequestSubmittedScreen from '../screens/RequestSubmittedScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import CustomerFormScreen from '../screens/CustomerFormScreen';
import CustomerDetailsScreen from '../screens/CustomerDetailsScreen';
import AgentChatScreen from '../screens/AgentChatScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="SelectEquipment" component={SelectEquipmentScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="IssueDescription" component={IssueDescriptionScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="RequestSubmitted" component={RequestSubmittedScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="SupportChat" component={SupportChatScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="CustomerDetails" component={CustomerDetailsScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Auth" component={AuthStack} options={{ gestureEnabled: false }}/>


    </Stack.Navigator>
  );
}
