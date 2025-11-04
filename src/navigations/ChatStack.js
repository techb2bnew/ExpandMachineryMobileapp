import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from '../screens/ChatListScreen';
import SupportChatScreen from '../screens/SupportChatScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="SupportChat" component={SupportChatScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Auth" component={AuthStack} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}

