import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import { useDispatch } from 'react-redux';
import { fetchUnreadCounts } from '../store/slices/unreadCountSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch unread counts when app starts (user is authenticated)
    const loadCounts = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          dispatch(fetchUnreadCounts());
        }
      } catch (error) {
        console.log('Load counts error:', error);
      }
    };
    loadCounts();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabs} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
  );
}
