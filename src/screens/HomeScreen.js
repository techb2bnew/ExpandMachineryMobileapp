import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AgentHome from '../components/AgentHome';
import CustomerHome from '../components/CustomerHome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const HomeScreen = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getDeviceId = async () => {
      const deviceId = await DeviceInfo.getUniqueId();
      console.log('📱 Device Unique ID:', deviceId);
    };

    getDeviceId();
  }, []);
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        let normalizedRole = null;
        if (storedRole) {
          try {
            normalizedRole = JSON.parse(storedRole);
          } catch {
            normalizedRole = storedRole;
          }
        }
        console.log('userRole::', normalizedRole);
        setUserRole(normalizedRole);
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
        <AgentHome navigation={navigation} />
      ) : (
        <CustomerHome navigation={navigation} />
      )}
    </View>
  );
};

export default HomeScreen;
