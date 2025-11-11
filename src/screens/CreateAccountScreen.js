import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Toast } from '../components/CustomToast';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { grayColor, lightBlack, lightColor, redColor, whiteColor } from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { style, spacings } from '../constans/Fonts';
import { APP_LOGO } from '../assests/images';
import { ALREADY_HAVE_ACCOUNT, CREATE_ACCOUNT, JOIN_EXPAND, FULL_NAME, ENTER_YOUR_FULL_NAME, EMAIL_ADDRESS, ENTER_YOUR_EMAIL, PHONE_NUMBER, ENTER_YOUR_PASSWORD, PASSWORD, CONFIRM_PASSWORD, CONFIRM_YOUR_PASSWORD, SIGN_IN, ENTER_YOUR_PHONE_NUMBER, API_ENDPOINTS } from '../constans/Constants';

const isPhoneNumberPatternValid = (value) => /^\+?[0-9\s()\-]*$/.test(value.trim());

const getDigitCount = (value) => value.replace(/\D/g, '').length;

const normalizePhoneNumberForApi = (value) => value.replace(/\D/g, '').slice(0, 15);

const CreateAccountScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Error states
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [serverError, setServerError] = useState('');

    // Check if all fields are filled and passwords match
    const isFormComplete = fullName.trim() && email.trim() && phone.trim() && password.trim() && confirmPassword.trim();

    const validateForm = () => {
        let valid = true;

        if (!fullName.trim()) {
            setFullNameError('Full name is required');
            valid = false;
        } else {
            setFullNameError('');
        }

        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Enter a valid email');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!phone.trim()) {
            setPhoneError('Phone number is required');
            valid = false;
        } else {
            const digitCount = getDigitCount(phone);

            if (!isPhoneNumberPatternValid(phone) || digitCount < 10 || digitCount > 15) {
                setPhoneError('Enter a valid phone number');
                valid = false;
            } else {
                setPhoneError('');
            }
        }

        if (!password.trim()) {
            setPasswordError('Password is required');
            valid = false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Confirm your password');
            valid = false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            valid = false;
        } else {
            setConfirmPasswordError('');
        }

        return valid;
    };

    const handleCreateAccount = async () => {
        if (!validateForm() || !isFormComplete) {
            return;
        }

        setIsLoading(true);
        setServerError('');

        try {
            const payload = {
                name: fullName.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: normalizePhoneNumberForApi(phone),
                password: password.trim()
            };

            console.log('API Payload:', payload);

            const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/auth/register`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('API Response:', data);
            console.log('Response Status:', response);


            if (response.ok) {
                // Navigate to login after a short delay
                navigation.navigate('Login');
            } else {
                // Handle API errors
                const errorMsg = data.message || data.error || 'Something went wrong. Please try again.';
                console.log('Server Error:', errorMsg);

                setServerError(errorMsg);
            }
        } catch (error) {
            console.error('Registration Error:', error);
            setServerError('Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Image source={APP_LOGO} style={styles.logo} />

                    <Text style={styles.title}>{CREATE_ACCOUNT}</Text>
                    {/* <Text style={styles.subtitle}> */}
                        {/* {JOIN_EXPAND} */}
                    {/* </Text> */}

                    <View style={styles.form}>
                        <CustomTextInput
                            label={FULL_NAME}
                            placeholder={ENTER_YOUR_FULL_NAME}
                            icon="person-outline"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                setFullNameError('');
                            }}
                            required={true}
                            error={fullNameError}
                        />

                        <CustomTextInput
                            label={EMAIL_ADDRESS}
                            placeholder={ENTER_YOUR_EMAIL}
                            icon="mail-outline"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text.toLowerCase());
                                setEmailError('');
                            }}
                            required={true}
                            error={emailError}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <CustomTextInput
                            label={PHONE_NUMBER}
                            placeholder={ENTER_YOUR_PHONE_NUMBER}
                            icon="call-outline"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(text);
                                setPhoneError('');
                            }}
                            required={true}
                            error={phoneError}
                            keyboardType="phone-pad"
                            maxLength={15}
                        />

                        <CustomTextInput
                            label={PASSWORD}
                            placeholder={ENTER_YOUR_PASSWORD}
                            icon="lock-closed-outline"
                            rightIcon={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
                            required={true}
                            onRightIconPress={() => setShowPassword(!showPassword)}
                            error={passwordError}
                        />

                        <CustomTextInput
                            label={CONFIRM_PASSWORD}
                            placeholder={CONFIRM_YOUR_PASSWORD}
                            icon="lock-closed-outline"
                            rightIcon={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setConfirmPasswordError('');
                            }}
                            required={true}
                            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            error={confirmPasswordError}
                        />

                        {serverError ? (
                            <Text style={styles.serverErrorText}>{serverError}</Text>
                        ) : null}

                        <CustomButton
                            title={isLoading ? 'Creating Account...' : CREATE_ACCOUNT}
                            onPress={handleCreateAccount}
                            disabled={!isFormComplete || isLoading}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{ALREADY_HAVE_ACCOUNT} </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>{SIGN_IN}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightColor,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacings.large,
        minHeight: hp(100),
    },
    logo: {
        width: wp(24),
        height: hp(12),
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
    serverErrorText: {
        color: redColor,
        marginBottom: spacings.large,
    },
});

export default CreateAccountScreen;
