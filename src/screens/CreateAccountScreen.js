import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { grayColor, lightBlack, lightColor, whiteColor } from '../constans/Color';
import { BaseStyle } from '../constans/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { style, spacings } from '../constans/Fonts';
import { APP_LOGO } from '../assests/images';
import { ALREADY_HAVE_ACCOUNT, CREATE_ACCOUNT, JOIN_EXPAND, FULL_NAME, ENTER_YOUR_FULL_NAME, EMAIL_ADDRESS, ENTER_YOUR_EMAIL, PHONE_NUMBER, ENTER_YOUR_PHONE_NUMBER, ENTER_YOUR_PASSWORD, PASSWORD, CONFIRM_PASSWORD, CONFIRM_YOUR_PASSWORD, SIGN_IN } from '../constans/Constants';

const CreateAccountScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Error states
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
        } else if (!/^[0-9]{10}$/.test(phone)) {
            setPhoneError('Enter a valid 10-digit phone number');
            valid = false;
        } else {
            setPhoneError('');
        }

        if (!password.trim()) {
            setPasswordError('Password is required');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
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

    const handleCreateAccount = () => {
        if (validateForm()) {
            console.log('Create Account ✅', {
                fullName,
                email,
                phone,
                password,
            });
            // API call yaha karega
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
                    <Text style={styles.subtitle}>{JOIN_EXPAND}</Text>

                    <View style={styles.form}>
                        <CustomTextInput
                            label={FULL_NAME}
                            placeholder={ENTER_YOUR_FULL_NAME}
                            icon="person-outline"
                            value={fullName}
                            onChangeText={setFullName}
                            error={fullNameError}
                        />

                        <CustomTextInput
                            label={EMAIL_ADDRESS}
                            placeholder={ENTER_YOUR_EMAIL}
                            icon="mail-outline"
                            value={email}
                            onChangeText={setEmail}
                            error={emailError}
                        />

                        <CustomTextInput
                            label={PHONE_NUMBER}
                            placeholder={ENTER_YOUR_PHONE_NUMBER}
                            icon="call-outline"
                            value={phone}
                            onChangeText={setPhone}
                            error={phoneError}
                            keyboardType="phone-pad"
                        />

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

                        <CustomTextInput
                            label={CONFIRM_PASSWORD}
                            placeholder={CONFIRM_YOUR_PASSWORD}
                            icon="lock-closed-outline"
                            rightIcon={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            error={confirmPasswordError}
                        />

                        <CustomButton title={CREATE_ACCOUNT} onPress={handleCreateAccount} />
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
        backgroundColor:lightColor,
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
        fontWeight:style.fontWeightBold.fontWeight,
    },
});

export default CreateAccountScreen;
