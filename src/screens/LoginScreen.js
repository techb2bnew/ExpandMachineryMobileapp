import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { grayColor, whiteColor, redColor } from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { style, spacings } from '../constans/Fonts';
import {
  WELCOME_BACK, SIGN_IN_TO_YOUR_ACCOUNT, EMAIL_ADDRESS, ENTER_YOUR_EMAIL, PASSWORD, ENTER_YOUR_PASSWORD, SIGN_IN, DONT_HAVE_ACCOUNT, CREATE_ACCOUNT,
} from '../constans/Constants';
import { APP_LOGO } from '../assests/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { flex, alignJustifyCenter } = BaseStyle;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        // Fake API delay
        setTimeout(async () => {
          const fakeToken = 'user-demo-token';

          // save token and email in AsyncStorage
          await AsyncStorage.setItem('userToken', fakeToken);
          await AsyncStorage.setItem('userEmail', email);

          // Token stored, AppNavigator will automatically detect and navigate
          console.log('Login successful, token stored!');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.log('Login error:', error);
        Alert.alert('Error', 'Something went wrong, please try again.');
        setIsLoading(false);
      }
    }
  };


  return (
    <KeyboardAvoidingView
      style={[flex, { backgroundColor: '#2F2F2F' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={[
          alignJustifyCenter,
          { padding: spacings.large, flexGrow: 1 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

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
            onChangeText={setEmail}
            error={emailError}
          />

          {/* Password */}
          <CustomTextInput
            label={PASSWORD}
            placeholder={ENTER_YOUR_PASSWORD}
            icon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={passwordError}
          />

          <CustomButton title={SIGN_IN} onPress={handleLogin} loading={isLoading} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{DONT_HAVE_ACCOUNT} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
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
    backgroundColor: '#3F3F3F',
    borderRadius: 10,
    padding: spacings.xxxLarge,
    marginVertical: spacings.xxxLarge,
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
});

export default LoginScreen;
