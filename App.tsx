import React, { useEffect, useRef, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigations/AuthStack';
import MainStack from './src/navigations/MainStack';
import SplashScreen from './src/screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform, AppState } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP, setNavigationRef } from './src/utils';
import CustomToast from './src/components/CustomToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import { Toast } from './src/components/CustomToast';
import { connectSocket, disconnectSocket, getSocket } from './src/socket/socket';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const appState = useRef(AppState.currentState);
  const socketRef = useRef(null);
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Check internet connection first
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          Toast.show({ message: 'Internet connection is required to use this app', type: 'error' });
        }

        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
        // setIsLoading(false)
        if (token) {
          console.log('🚀 App launched with token, connecting socket...');
          socketRef.current = connectSocket(token);
          socketRef.current.emit('user_online', { status: true });
        }
      } catch (e) {
        console.log('error reading token', e);
      }
      setTimeout(() => setIsLoading(false), 3000);
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      console.log('📱 App State Changed:', nextAppState);

      // 🔹 When app comes to foreground or active
      if (nextAppState === 'active') {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          console.log('🔌 Reconnecting socket...');
          socketRef.current = connectSocket(token);

          socketRef.current.emit('user_online', { status: true });
        }
      }

      // 🔹 When app goes to background or inactive
      if (nextAppState.match(/inactive|background/)) {
        const socket = getSocket();
        if (socket) {
          console.log('❌ App in background, disconnecting socket...');
          socket.emit('user_offline', { status: false });
          disconnectSocket();
        }
      }

      appState.current = nextAppState;
    };

    // Add event listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // Lock screen orientation to portrait
  useEffect(() => {
    // For iOS, orientation is locked via Info.plist
    // For Android, orientation is locked via AndroidManifest.xml
    // No additional code needed for React Native
  }, []);

  // Listen for connection changes throughout app lifecycle
  useEffect(() => {
    // Listen for connection changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Toast.show({ message: 'Internet connection is required to use this app', type: 'error' });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View
          style={{
            width: widthPercentageToDP(100),
            height: heightPercentageToDP(100),
            backgroundColor: '#2F2F2F',
          }}
        >
          <NavigationContainer
            ref={(ref) => {
              setNavigationRef(ref);
            }}
          >
            {isLoading ? (
              <SplashScreen />
            ) : userToken ? (
              <MainStack />
            ) : (
              <AuthStack />
            )}
          </NavigationContainer>
          <CustomToast />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
