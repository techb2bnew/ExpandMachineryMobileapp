import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Toast } from '../components/CustomToast';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {
  grayColor,
  whiteColor,
  redColor,
  lightColor,
  lightBlack,
} from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utils';
import { style, spacings } from '../constans/Fonts';
import {
  WELCOME_BACK,
  SIGN_IN_TO_YOUR_ACCOUNT,
  EMAIL_ADDRESS,
  ENTER_YOUR_EMAIL,
  PASSWORD,
  ENTER_YOUR_PASSWORD,
  SIGN_IN,
  DONT_HAVE_ACCOUNT,
  CREATE_ACCOUNT,
} from '../constans/Constants';
import { APP_LOGO } from '../assests/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
const { flex, alignJustifyCenter } = BaseStyle;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false); // ✅ New state

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Simple Validation
  const validateForm = () => {
    let valid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  // const handleLogin = async () => {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const payload = {
  //       email: email.trim().toLowerCase(),
  //       password: password.trim(),
  //     };

  //     console.log('Login API Payload:', payload);

  //     const response = await fetch('http://54.67.70.211/api/app/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await response.json();
  //     console.log('Login API Response:', data);

  //     if (response.ok) {
  //       // Save token and email in AsyncStorage
  //       if (data.token) {
  //         await AsyncStorage.setItem('userToken', data.token);
  //         await AsyncStorage.setItem('userEmail', email);
  //       } else {
  //         // If no token in response, save a default one
  //         await AsyncStorage.setItem('userToken', 'user-login-token');
  //         await AsyncStorage.setItem('userEmail', email);
  //       }

  //       Toast.show({
  //         type: 'success',
  //         text1: 'Login Successful',
  //         text2: 'Welcome back!',
  //         visibilityTime: 3000,
  //       });

  //       // Navigate to main app
  //       setTimeout(() => {
  //         navigation.reset({
  //           index: 0,
  //           routes: [{ name: 'Tabs' }],
  //         });
  //       }, 1500);
  //     } else {
  //       // Handle API errors
  //       const errorMsg =
  //         data.message ||
  //         data.error ||
  //         'Login failed. Please check your credentials.';
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Login Failed',
  //         text2: errorMsg,
  //         visibilityTime: 4000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Network Error',
  //       text2: 'Please check your connection and try again.',
  //       visibilityTime: 4000,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      };

      console.log('Login API Payload:', payload);

      // const response = await fetch('http://54.67.70.211/api/app/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload),
      // });

      // const data = await response.json();
      // console.log('Login API Response:', data);

      await AsyncStorage.setItem('userToken',email);
      // if (response.ok) {
      //   // Save token and email in AsyncStorage
      //   if (data.token) {
      //     await AsyncStorage.setItem('userEmail', email);
      //   } else {
      //     // If no token in response, save a default one
      //     await AsyncStorage.setItem('userToken', 'user-login-token');
      //     await AsyncStorage.setItem('userEmail', email);
      //   }

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          visibilityTime: 3000,
        });

        // Navigate to main app
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
        }, 1500);
      }
      //  else {
      //   // Handle API errors
      //   const errorMsg =
      //     data.message ||
      //     data.error ||
      //     'Login failed. Please check your credentials.';
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Login Failed',
      //     text2: errorMsg,
      //     visibilityTime: 4000,
      //   });
      // }
     catch (error) {
      console.error('Login Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please check your connection and try again.',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={[flex, { backgroundColor: lightColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={[
          alignJustifyCenter,
          { padding: spacings.large, flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={APP_LOGO} style={styles.logo} />

        <Text style={styles.title}>{WELCOME_BACK}</Text>
        <Text style={styles.subtitle}>{SIGN_IN_TO_YOUR_ACCOUNT}</Text>

        <View style={styles.form}>
          {/* Email */}
          <CustomTextInput
            label={EMAIL_ADDRESS}
            placeholder={ENTER_YOUR_EMAIL}
            icon="mail-outline"
            value={email}
            onChangeText={text => {
              setEmail(text.toLowerCase());
              setEmailError('');
            }}
            error={emailError}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password */}
          <CustomTextInput
            label={PASSWORD}
            placeholder={ENTER_YOUR_PASSWORD}
            icon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => {
              setPassword(text);
              setPasswordError('');
            }}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={passwordError}
          />
          {/* <TouchableOpacity
            style={[styles.checkboxContainer]}
            activeOpacity={0.8}
            onPress={() => setKeepLoggedIn(!keepLoggedIn)}>
            <Icon
              name={keepLoggedIn ? 'checkbox' : 'square-outline'}
              size={22}
              color={keepLoggedIn ? whiteColor : grayColor}
            />
            <Text style={styles.checkboxText}>Stay signed In</Text>
          </TouchableOpacity> */}

          <CustomButton
            title={SIGN_IN}
            onPress={handleLogin}
            loading={isLoading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{DONT_HAVE_ACCOUNT} </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.link}> {CREATE_ACCOUNT}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: wp(28),
    height: hp(14),
    borderRadius: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    marginBottom: spacings.small2x,
  },
  subtitle: {
    fontSize: style.fontSizeNormal.fontSize,
    color: grayColor,
  },
  form: {
    width: '100%',
    backgroundColor: lightBlack,
    borderRadius: 10,
    padding: spacings.xxxLarge,
    marginVertical: spacings.xxLarge,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacings.xxLarge,
  },
  footerText: {
    color: whiteColor,
  },
  link: {
    color: whiteColor,
    fontWeight: style.fontWeightBold.fontWeight,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.large,
  },
  checkboxText: {
    marginLeft: 10,
    color: whiteColor,
    fontSize: 16,
  },
});

export default LoginScreen;
