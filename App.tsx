import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigations/AuthStack';
import MainStack from './src/navigations/MainStack';
import SplashScreen from './src/screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP, setNavigationRef } from './src/utils';
import CustomToast from './src/components/CustomToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
        // setIsLoading(false)
      } catch (e) {
        console.log('error reading token', e);
      }
      setTimeout(() => setIsLoading(false), 3000);
    };
    bootstrap();
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
