import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import OTPTextInput from 'react-native-otp-textinput';
import {
  grayColor,
  whiteColor,
  redColor,
  lightColor,
  lightBlack,
  greenColor,
} from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../utils';
import { style, spacings } from '../constans/Fonts';
import { API_ENDPOINTS } from '../constans/Constants';
import Icon from 'react-native-vector-icons/Ionicons';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter } = BaseStyle;

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [otpKey, setOtpKey] = useState(0); // Key to force OTP component re-render
  const [resetToken, setResetToken] = useState(''); // Token from verify OTP response

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Success modal animation
  useEffect(() => {
    if (showSuccessModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [showSuccessModal]);

  // Step 1: Email validation
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  // Step 2: OTP validation
  const validateOTP = () => {
    if (!otp || otp.length < 4) {
      setOtpError('Please enter complete OTP');
      return false;
    } else {
      setOtpError('');
      return true;
    }
  };

  // Step 3: Password validation
  const validatePasswords = () => {
    let valid = true;

    if (!newPassword.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/app/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );

      const data = await response.json();
      console.log('data (send OTP):::::::', data);

      if (response.ok && data?.success) {
        setStep(2);
      } else {
        setServerError(data?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      setServerError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    setIsLoading(true);
    setServerError('');
    setOtpError('');

    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/app/auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();
      console.log('data (verify OTP):::::::', data);

      if (response.ok && data?.success) {
        // Store resetToken from response
        const token = data?.data?.resetToken || '';
        setResetToken(token);
        setStep(3);
      } else {
        setOtpError(data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      setOtpError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    if (!resetToken) {
      setServerError('Reset token is missing. Please verify OTP again.');
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/app/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resetToken}`,
          },
          body: JSON.stringify({
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim(),
          }),
        }
      );

      const data = await response.json();
      console.log('data (reset password):::::::', data);

      if (response.ok && data?.success) {
        setShowSuccessModal(true);
      } else {
        setServerError(data?.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      setServerError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    console.log('handleResendOTP called, resendTimer:', resendTimer, 'email:', email);
    
    if (resendTimer > 0) {
      console.log('Resend timer is active, returning early');
      return;
    }

    if (!email || !email.trim()) {
      console.log('Email is missing');
      setOtpError('Email is required to resend OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');
    setServerError('');

    try {
      const requestBody = { email: email.trim().toLowerCase() };
      console.log('Resend OTP API call, body:', requestBody);
      
      const response = await fetch(
        `${API_ENDPOINTS.BASE_URL}/api/app/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log('Resend OTP response status:', response.status);
      const data = await response.json();
      console.log('data (resend OTP):::::::', data);

      if (response.ok && data?.success) {
        console.log('Resend OTP successful, clearing OTP and starting timer');
        // Clear OTP and start timer
        setOtp('');
        setOtpError('');
        setOtpKey(prev => prev + 1); // Force OTP component to re-render and clear
        setResendTimer(30); // Start 30 seconds timer
        // Clear resetToken if exists (since new OTP is sent)
        setResetToken('');
      } else {
        console.log('Resend OTP failed:', data?.message);
        setOtpError(data?.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setOtpError('Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter Your Email</Text>
      <Text style={styles.stepDescription}>
        We'll send you an OTP to reset your password
      </Text>

      <CustomTextInput
        label="Email Address"
        placeholder="Enter your email"
        icon="mail-outline"
        value={email}
        onChangeText={(text) => {
          setEmail(text.toLowerCase());
          setEmailError('');
          setServerError('');
        }}
        error={emailError}
        autoCapitalize="none"
        keyboardType="email-address"
        required={true}
      />

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <CustomButton
        title="Continue"
        onPress={handleSendOTP}
        loading={isLoading}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Enter OTP</Text>
      <Text style={styles.stepDescription}>
        We've sent a 6-digit OTP to {email}
      </Text>

      <View style={styles.otpContainer}>
        <OTPTextInput
          key={otpKey}
          inputCount={6}
          defaultValue={otp}
          handleTextChange={(text) => {
            setOtp(text);
            setOtpError('');
            setServerError('');
          }}
          tintColor={otpError ? redColor : whiteColor}
          offTintColor={grayColor}
          textInputStyle={[
            styles.otpInput,
            otpError && styles.otpInputError,
          ]}
          containerStyle={styles.otpInputContainer}
          inputCellLength={1}
          keyboardType="number-pad"
          autoFocus={true}
        />
        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
      </View>

      <View style={[flexDirectionRow, alignItemsCenter, styles.resendContainer]}>
        <Text style={styles.resendText}>Didn't receive OTP? </Text>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={resendTimer > 0 || isLoading}
        >
          <Text
            style={[
              styles.resendButton,
              (resendTimer > 0 || isLoading) && styles.resendButtonDisabled,
            ]}
          >
            {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <CustomButton
        title="Next"
        onPress={handleVerifyOTP}
        loading={isLoading}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set New Password</Text>
      <Text style={styles.stepDescription}>
        Create a strong password for your account
      </Text>

      <CustomTextInput
        label="New Password"
        placeholder="Enter new password"
        icon="lock-closed-outline"
        rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          setPasswordError('');
          setServerError('');
        }}
        required={true}
        onRightIconPress={() => setShowPassword(!showPassword)}
        error={passwordError}
      />

      <CustomTextInput
        label="Confirm Password"
        placeholder="Confirm new password"
        icon="lock-closed-outline"
        rightIcon={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
        secureTextEntry={!showConfirmPassword}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setConfirmPasswordError('');
          setServerError('');
        }}
        required={true}
        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
        error={confirmPasswordError}
      />

      {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

      <CustomButton
        title="Submit"
        onPress={handleResetPassword}
        loading={isLoading}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[flex, { backgroundColor: lightColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={[
          // alignJustifyCenter,
          { padding: spacings.large, flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={whiteColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="none"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={[alignJustifyCenter, styles.successIconContainer]}>
                <Icon name="checkmark-circle" size={60} color={greenColor} />
              </View>
              <Text style={styles.modalTitle}>Password Reset Successful!</Text>
              <Text style={styles.modalMessage}>
                Your password has been changed successfully. Please login with
                your new password.
              </Text>
              <CustomButton
                title="OK"
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('Login');
                }}
                style={styles.modalButton}
              />
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacings.medium,
    paddingHorizontal: 0,
    paddingTop:Platform.OS === 'ios' ? hp(4) : hp(1),
  },
  backButton: {
    padding: spacings.small,
  },
  title: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    flex: 1,
    marginLeft: spacings.medium,
  },
  stepContainer: {
    width: '100%',
    backgroundColor: lightBlack,
    borderRadius: 10,
    padding: spacings.xxLarge,
    marginVertical: spacings.xxLarge,
  },
  stepTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    marginBottom: spacings.small2x,
  },
  stepDescription: {
    fontSize: style.fontSizeNormal.fontSize,
    color: whiteColor,
    marginBottom: spacings.xxLarge,
  },
  otpContainer: {
    marginBottom: spacings.xxLarge,
    alignItems: 'center',
  },
  otpInputContainer: {
    marginHorizontal: 0,
  },
  otpInput: {
    backgroundColor: lightColor,
    borderColor: grayColor,
    borderWidth: 1,
    borderRadius: 8,
    color: whiteColor,
    fontSize: 24,
    fontWeight: 'bold',
    height: hp(7),
    width: wp(12),
  },
  otpInputError: {
    borderColor: redColor,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.xxLarge,
    marginTop: spacings.medium,
  },
  resendText: {
    color: whiteColor ,
    fontSize: style.fontSizeNormal.fontSize,
  },
  resendButton: {
    color: whiteColor,
    fontSize: style.fontSizeNormal.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    textDecorationLine: 'underline',
    marginLeft: spacings.small,
  },
  resendButtonDisabled: {
    color: grayColor,
    textDecorationLine: 'none',
  },
  errorText: {
    color: redColor,
    fontSize: style.fontSizeSmall2x.fontSize,
    marginTop: spacings.small,
    marginBottom: spacings.medium,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    ...alignJustifyCenter,
    padding: spacings.large,
  },
  modalContent: {
    backgroundColor: lightBlack,
    borderRadius: 10,
    padding: spacings.xxLarge,
    width: '100%',
    maxWidth: wp(85),
    // alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: lightColor,
    marginBottom: spacings.large,
    ...alignJustifyCenter,
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    marginBottom: spacings.medium,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: style.fontSizeNormal.fontSize,
    color: whiteColor ,
    textAlign: 'center',
    marginBottom: spacings.xLarge,
  },
  modalButton: {
    width: wp(60),
    marginTop: spacings.medium,
  },
});

export default ForgotPasswordScreen;

