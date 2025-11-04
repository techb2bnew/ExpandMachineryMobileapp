import React, { useState, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    darkgrayColor,
    whiteColor,
    lightGrayColor,
    grayColor,
    lightBlack,
    lightColor,
    lightPinkAccent,
    greenColor,
    redColor,
} from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    fetchWithAuth,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { API_ENDPOINTS } from '../constans/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from '../components/CustomToast';

const {
    flex,
    alignJustifyCenter,
    flexDirectionRow,
    alignItemsCenter,
    justifyContentSpaceBetween,
} = BaseStyle;

const formatDisplayName = (value) => {
    if (!value || typeof value !== 'string') {
        return '';
    }
    const trimmed = value.trim();
    if (!trimmed.length) {
        return '';
    }
    return trimmed
        .split(/\s+/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const ReportAndIssueScreen = ({ navigation }) => {
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch customer profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/profile`, {
                    method: 'GET',
                });
                const data = await response.json();

                if (response.ok) {
                    const customer = data?.data?.customer || data?.customer || data?.data || data;
                    setProfileData(customer);
                }
            } catch (error) {
                console.log('Profile fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async () => {
        if (!description.trim()) {
            console.log('Please enter a description', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/report-issue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: description.trim(),
                }),
            });

            const data = await response.json();
            console.log('Report Issue Response:', data);

            if (response.ok && data?.message) {
                // Clear description first
                setDescription('');
                // Navigate back after success
                navigation.goBack();
            } else {
                console.log(data?.message || 'Failed to submit report', 'error');
            }
        } catch (error) {
            console.log('Submit report error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const customerName = profileData?.name
        ? formatDisplayName(profileData.name)
        : 'Customer';

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, alignJustifyCenter]}>
                    <ActivityIndicator size="large" color={whiteColor} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={[styles.header, flexDirectionRow, alignItemsCenter]}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name="arrow-back" size={24} color={whiteColor} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Report and Issue</Text>
                            <Text style={styles.headerSubtitle}>Submit a report or issue</Text>
                        </View>
                    </View>

                    {/* Customer Details Card */}
                    <View style={styles.customerCard}>
                        <View style={[flexDirectionRow, alignItemsCenter, styles.customerHeader]}>
                            <View style={[styles.customerIcon, alignJustifyCenter]}>
                                <Feather name="user" size={20} color={whiteColor} />
                            </View>
                            <Text style={styles.customerLabel}>Customer Details</Text>
                        </View>
                        <View style={styles.separator} />
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Name</Text>
                            <Text style={styles.detailValue}>{customerName}</Text>
                        </View>
                    </View>

                    {/* Description Input */}
                    <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Description *</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Enter your report or issue description..."
                            placeholderTextColor={grayColor}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                        <Text style={styles.charCount}>
                            {description.length}/500
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (isSubmitting || !description.trim()) && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={isSubmitting || !description.trim()}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color={whiteColor} />
                        ) : (
                            <>
                                <Icon name="send" size={20} color={whiteColor} />
                                <Text style={styles.submitButtonText}>Submit Report</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ReportAndIssueScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightColor,
        width: wp(100),
        height: hp(100),
    },
    scrollContent: {
        padding: spacings.xLarge,
        paddingBottom: spacings.xxLarge,
    },
    header: {
        marginBottom: spacings.xxLarge,
        paddingHorizontal: spacings.small,
    },
    backButton: {
        padding: spacings.small,
        marginRight: spacings.medium,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: style.fontSizeLarge.fontSize,
        fontWeight: style.fontWeightThin1x.fontWeight,
        color: whiteColor,
    },
    headerSubtitle: {
        ...style.fontSizeNormal,
        ...style.fontWeightThin,
        color: whiteColor,
        marginTop: spacings.xsmall,
    },
    customerCard: {
        backgroundColor: lightBlack,
        borderRadius: 12,
        padding: spacings.xxLarge,
        marginBottom: spacings.xLarge,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: lightColor,
    },
    customerHeader: {
        marginBottom: spacings.large,
    },
    customerIcon: {
        width: wp(10),
        height: hp(5),
        borderRadius: 20,
        backgroundColor: lightPinkAccent,
        marginRight: spacings.medium,
    },
    customerLabel: {
        ...style.fontSizeMedium,
        ...style.fontWeightBold,
        color: whiteColor,
    },
    separator: {
        height: 1,
        backgroundColor: grayColor,
        opacity: 0.3,
        marginBottom: spacings.large,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacings.small,
    },
    detailLabel: {
        ...style.fontSizeNormal,
        ...style.fontWeightThin,
        color: lightGrayColor,
        flex: 0.4,
    },
    detailValue: {
        ...style.fontSizeNormal,
        ...style.fontWeightBold,
        color: whiteColor,
        flex: 0.6,
        textAlign: 'right',
    },
    inputCard: {
        backgroundColor: lightBlack,
        borderRadius: 12,
        padding: spacings.xxLarge,
        marginBottom: spacings.xLarge,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: lightColor,
    },
    inputLabel: {
        ...style.fontSizeNormal,
        ...style.fontWeightBold,
        color: whiteColor,
        marginBottom: spacings.large,
    },
    descriptionInput: {
        backgroundColor: lightColor,
        borderRadius: 8,
        padding: spacings.large,
        color: whiteColor,
        fontSize: style.fontSizeNormal.fontSize,
        minHeight: hp(18),
        borderWidth: 1,
        borderColor: grayColor,
        marginBottom: spacings.small,
        textAlignVertical: 'top',
    },
    charCount: {
        ...style.fontSizeSmall1x,
        ...style.fontWeightThin,
        color: grayColor,
        textAlign: 'right',
        marginTop: spacings.xsmall,
    },
    submitButton: {
        backgroundColor: lightPinkAccent,
        borderRadius: 8,
        paddingVertical: spacings.large,
        paddingHorizontal: spacings.xxLarge,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacings.xxLarge,
        gap: spacings.small,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: grayColor,
        opacity: 0.5,
    },
    submitButtonText: {
        ...style.fontSizeNormal,
        ...style.fontWeightBold,
        color: whiteColor,
        marginLeft: spacings.xsmall,
    },
});

