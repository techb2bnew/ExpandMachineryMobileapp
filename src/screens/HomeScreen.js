import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AgentHome from '../components/AgentHome';
import CustomerHome from '../components/CustomerHome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (e) {
        console.log('error reading userRole', e);
      } finally {
        setIsLoading(false); // 👈 ensures render waits
      }
    };
    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // 👇 Now render correct home
  return (
    <View style={{ flex: 1 }}>
      {userRole === 'agent' ? (
        <CustomerHome navigation={navigation} />
      ) : (
        <AgentHome navigation={navigation} />
      )}
    </View>
  );
};

export default HomeScreen;
