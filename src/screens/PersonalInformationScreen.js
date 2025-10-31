import React, { useState, useCallback } from 'react';
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
import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightPinkAccent, lightBlack, lightColor, greenColor, blueColor } from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { BaseStyle } from '../constans/Style';
import Feather from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { API_ENDPOINTS } from '../constans/Constants';
import { Toast } from '../components/CustomToast';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

const formatMemberSince = (memberSinceValue, createdAtValue) => {
  if (memberSinceValue) {
    return memberSinceValue;
  }

  if (!createdAtValue) {
    return '2021';
  }

  const parsedDate = new Date(createdAtValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '2021';
  }

  return parsedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

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

const hasAccountDeletedMessage = (payload) => {
  const message = payload?.message;
  if (typeof message === 'string' && message.toLowerCase().includes('account has been deleted')) {
    return true;
  }

  return payload?.success === false && typeof message === 'string';
};

const calculateMembershipDuration = (memberSinceValue, createdAtValue) => {
  const sourceValue = createdAtValue || memberSinceValue;

  if (!sourceValue) {
    return { value: 0, label: 'Days' };
  }

  const startDate = new Date(sourceValue);

  if (Number.isNaN(startDate.getTime())) {
    return { value: 0, label: 'Days' };
  }

  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();

  if (diffMs <= 0) {
    return { value: 0, label: 'Days' };
  }

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
  const totalYears = Math.floor(totalMonths / 12);

  if (totalYears >= 1) {
    return { value: totalYears, label: totalYears === 1 ? 'Year' : 'Years' };
  }

  if (totalMonths >= 1) {
    return { value: totalMonths, label: totalMonths === 1 ? 'Month' : 'Months' };
  }

  return { value: totalDays, label: totalDays === 1 ? 'Day' : 'Days' };
};

const formatAccountType = (customer) => {
  if (customer?.membershipStatus) {
    return customer.membershipStatus;
  }

  if (customer?.role) {
    return customer.role.charAt(0).toUpperCase() + customer.role.slice(1).toLowerCase();
  }

  return 'Premium';
};

const sanitizePhoneNumber = (value = '') => value.replace(/\D/g, '');

const PersonalInformationScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    accountType: '',
    memberSince: '',
    totalSupportTickets: 0,
    registeredMachines: 0,
    createdAt: null,
  });
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });


  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/profile`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Personal Info Profile Response:', data);

      if (!response.ok) {
        return;
      }

      const customer = data?.data?.customer || data?.customer || data?.data || data;

      const updatedMemberSince = formatMemberSince(customer?.memberSince, customer?.createdAt);
      const updatedAccountType = formatAccountType(customer);

      setUserData(prev => ({
        ...prev,
        fullName: customer?.name || prev.fullName,
        email: customer?.email || prev.email,
        phone: customer?.phone || customer?.phoneNumber || prev.phone,
        accountType: updatedAccountType || prev.accountType,
        memberSince: updatedMemberSince || prev.memberSince,
        totalSupportTickets: customer?.totalSupportTickets ?? prev.totalSupportTickets,
        registeredMachines: customer?.machinesOwned ?? customer?.machines ?? prev.registeredMachines,
        profileImage: customer?.profileImage ?? prev.profileImage,
        createdAt: customer?.createdAt || prev.createdAt,
      }));

      if (!isEditing) {
        setEditData(prev => ({
          ...prev,
          fullName: customer?.name || prev.fullName,
          email: customer?.email || prev.email,
          phone: customer?.phone || customer?.phoneNumber || prev.phone,
        }));
      }
    } catch (error) {
      console.log('Personal Info Profile Error:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [isEditing]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile])
  );

  const membershipDuration = calculateMembershipDuration(userData?.memberSince, userData?.createdAt);
  const membershipText = `Member since ${userData?.memberSince || '2021'} (${membershipDuration?.value} ${membershipDuration?.label})`;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
    });
  };

  const handleSave = async () => {
    const trimmedName = editData.fullName?.trim() || '';
    const trimmedPhone = editData.phone?.trim() || '';
    const currentEmail = userData.email || editData.email || '';

    try {
      setIsSaving(true);

      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        console.log("Personal Info Update Token Error:", token);

        return;
      }

      const payload = {
        name: trimmedName,
        email: currentEmail,
        phone: sanitizePhoneNumber(trimmedPhone),
      };

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/profile`, {
        method: 'PUT',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Personal Info Update Response:', data);

      if (response.ok) {
        const customer = data?.customer || data?.data?.customer || data?.data || data;
        const updatedMemberSince = formatMemberSince(customer?.memberSince, customer?.createdAt);
        const updatedAccountType = formatAccountType(customer);

        const nextUserData = {
          fullName: customer?.name ?? trimmedName ?? userData.fullName,
          email: customer?.email ?? currentEmail,
          phone: customer?.phone ?? customer?.phoneNumber ?? sanitizePhoneNumber(trimmedPhone) ?? userData.phone,
          accountType: updatedAccountType || userData.accountType,
          memberSince: updatedMemberSince || userData.memberSince,
          totalSupportTickets: customer?.totalSupportTickets ?? userData.totalSupportTickets,
          registeredMachines: customer?.machinesOwned ?? customer?.machines ?? userData.registeredMachines,
          profileImage: customer?.profileImage ?? userData.profileImage,
          createdAt: customer?.createdAt || userData.createdAt,
        };

        setUserData(nextUserData);
        setEditData({
          fullName: nextUserData.fullName || '',
          email: nextUserData.email || '',
          phone: nextUserData.phone || '',
        });

        setIsEditing(false);

      } else {
        const errorMsg = data?.message || data?.error || 'Unable to update profile. Please try again.';
        console.log("Personal Info Update Response Error:", errorMsg);
      }
    } catch (error) {
      console.log("Personal Info Update Error:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleCancel = () => {
    setEditData({
      fullName: userData.fullName || '',
      email: userData.email || '',
      phone: userData.phone || '',
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {profileLoading ? (
          <View style={[styles.loadingContainer, alignJustifyCenter]}>
            <ActivityIndicator size="large" color={whiteColor} />
          </View>
        ) : null}

        <ScrollView
          style={[styles.scrollView, profileLoading ? styles.hidden : null]}
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
              <Text style={styles.headerTitle}>Personal Information</Text>
              <Text style={styles.headerSubtitle}>Manage your profile details</Text>
            </View>
          </View>

          {/* User Profile Summary Card */}
          <View style={[styles.profileCard, alignJustifyCenter]}>
            <View style={[styles.avatar, alignJustifyCenter]}>
              <Feather name="user" size={40} color={whiteColor} />
            </View>
            <Text style={styles.userName}>{formatDisplayName(userData.fullName)}</Text>
            <Text style={styles.membershipText}>{membershipText}</Text>

            {!isEditing && (
              <TouchableOpacity
                style={[styles.editButton, flexDirectionRow, alignItemsCenter]}
                onPress={handleEdit}
                disabled={profileLoading}
              >
                <Icon name="pencil" size={16} color={whiteColor} />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Details Card */}
          <View style={styles.detailsCard}>
            <View style={[styles.cardHeader, flexDirectionRow, alignItemsCenter]}>
              <Icon name="person-outline" size={20} color={whiteColor} />
              <Text style={styles.cardTitle}>Profile Details</Text>
            </View>

            {/* Full Name Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={editData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={grayColor}
                />
              ) : (
                <View style={[styles.displayField, flexDirectionRow, alignItemsCenter]}>
                  <Text style={styles.displayText}>{userData.fullName}</Text>
                </View>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              {isEditing ? (
                <View style={[styles.inputContainer, flexDirectionRow, alignItemsCenter]}>
                  <Icon name="mail-outline" size={20} color={"blue"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInputWithIcon}
                    value={userData.email}
                    placeholder="Enter your email"
                    placeholderTextColor={grayColor}
                    keyboardType="email-address"
                    editable={false}
                    selectTextOnFocus={false}
                  />
                </View>
              ) : (
                <View style={[styles.displayField, flexDirectionRow, alignItemsCenter]}>
                  <Icon name="mail-outline" size={20} color={"blue"} style={styles.displayIcon} />
                  <Text style={[styles.displayText, { paddingLeft: spacings.medium }]}>{userData.email}</Text>
                </View>
              )}
            </View>

            {/* Phone Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              {isEditing ? (
                <View style={[styles.inputContainer, flexDirectionRow, alignItemsCenter]}>
                  <Icon name="call-outline" size={20} color={greenColor} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInputWithIcon}
                    value={editData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    placeholder="Enter your phone number"
                    placeholderTextColor={grayColor}
                    keyboardType="phone-pad"
                  />
                </View>
              ) : (
                <View style={[styles.displayField, flexDirectionRow, alignItemsCenter]}>
                  <Icon name="call-outline" size={20} color={greenColor} style={styles.displayIcon} />
                  <Text style={[styles.displayText, { paddingLeft: spacings.medium }]}>{userData.phone}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons (only show when editing) */}
            {isEditing && (
              <View style={[styles.actionButtons, flexDirectionRow, justifyContentSpaceBetween]}>
                <TouchableOpacity
                  style={[styles.cancelButton, flexDirectionRow, alignJustifyCenter]}
                  onPress={handleCancel}
                >
                  <Icon name="close" size={16} color={grayColor} />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, flexDirectionRow, alignJustifyCenter]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  <Icon name="save-outline" size={16} color={whiteColor} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Account Information Card */}
          <View style={styles.accountCard}>
            <Text style={styles.cardTitle}>Account Information</Text>

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Account Type</Text>
              <Text style={styles.infoValue}>{userData.accountType}</Text>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{userData.memberSince}</Text>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Total Support Tickets</Text>
              <Text style={styles.infoValue}>{userData.totalSupportTickets}</Text>
            </View>
          </View>


        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: Platform.OS === "ios" ? hp(95) : hp(89),
    backgroundColor: lightColor,
  },
  scrollView: {
    flex: 1,
    padding: spacings.large,
  },
  header: {
    marginBottom: spacings.large,
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
  profileCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginBottom: spacings.large,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: wp(22),
    height: hp(11),
    borderRadius: 40,
    backgroundColor: lightPinkAccent,
    marginBottom: spacings.large,
  },
  userName: {
    ...style.fontSizeLarge1x,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  membershipText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.large,
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: whiteColor,
    borderRadius: 8,
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
  },
  editButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  detailsCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginBottom: spacings.large,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: spacings.large,
  },
  cardTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightBold,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  fieldContainer: {
    marginBottom: spacings.large,
  },
  fieldLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
    marginBottom: spacings.medium,
  },
  displayField: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.medium,
  },
  displayText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  displayIcon: {
    marginRight: spacings.small,
  },
  textInput: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.medium,
    paddingVertical: spacings.large,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  inputContainer: {
    backgroundColor: lightColor,
    borderRadius: 8,
    paddingHorizontal: spacings.medium,
  },
  inputIcon: {
    marginRight: spacings.small,
  },
  textInputWithIcon: {
    flex: 1,
    padding: spacings.medium,
    paddingVertical: spacings.large,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  accountCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    padding: spacings.xxLarge,
    marginBottom: spacings.xLarge,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    paddingVertical: spacings.medium,
  },
  infoLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  infoValue: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  separator: {
    height: 1,
    backgroundColor: grayColor,
    opacity: 0.3,
  },
  actionButtons: {
    marginTop: spacings.large,
    marginBottom: spacings.xxLarge,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: grayColor,
    borderRadius: 8,
    paddingVertical: spacings.medium,
    marginRight: spacings.small,
  },
  cancelButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: grayColor,
    marginLeft: spacings.small,
  },
  saveButton: {
    flex: 1,
    backgroundColor: lightPinkAccent,
    borderRadius: 8,
    paddingVertical: spacings.medium,
    marginLeft: spacings.small,
    alignItems: 'center',
  },
  saveButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginLeft: spacings.small,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  hidden: {
    opacity: 0,
  },
});

export default PersonalInformationScreen;

