import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/AccountScreen';
import PersonalInformationScreen from '../screens/PersonalInformationScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountMain" component={AccountScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ gestureEnabled: false }}/>
      <Stack.Screen name="Auth" component={AuthStack} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}
