import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { whiteColor, grayColor } from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import { spacings, style } from '../constans/Fonts';

const Stack = createStackNavigator();
const { flex, alignJustifyCenter } = BaseStyle;

const LoadingScreen = () => (
  <View style={[flex, alignJustifyCenter, { backgroundColor: '#2F2F2F' }]}>
    <ActivityIndicator size="large" color={whiteColor} />
    <Text
      style={{
        color: whiteColor,
        marginTop: spacings.large,
        fontSize: style.fontSizeNormal.fontSize,
      }}
    >
      Loading...
    </Text>
  </View>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes to update auth state
    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: whiteColor,
          background: '#2F2F2F',
          card: '#3F3F3F',
          text: whiteColor,
          border: grayColor,
          notification: '#FF6B6B',
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainStack" component={MainStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
