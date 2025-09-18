import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightPinkAccent, lightBlack, lightColor, greenColor, blueColor } from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { BaseStyle } from '../constans/Style';
import Feather from 'react-native-vector-icons/Feather'
import { SafeAreaView } from 'react-native-safe-area-context';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

const PersonalInformationScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: 'John Smith',
    email: 'shubhambase2brand@gmail.com',
    phone: '+1 (555) 123-4567',
  });
  const [editData, setEditData] = useState({
    fullName: 'John Smith',
    email: 'shubhambase2brand@gmail.com',
    phone: '+1 (555) 123-4567',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
    console.log('Profile updated:', editData);
  };

  const handleCancel = () => {
    setEditData({ ...userData });
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
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.userName}>{userData.fullName}</Text>
            <Text style={styles.membershipText}>Premium Member since 2021</Text>

            {!isEditing && (
              <TouchableOpacity
                style={[styles.editButton, flexDirectionRow, alignItemsCenter]}
                onPress={handleEdit}
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
                    value={editData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    placeholder="Enter your email"
                    placeholderTextColor={grayColor}
                    keyboardType="email-address"
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
              <Text style={styles.infoValue}>Premium</Text>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>March 2021</Text>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Total Support Tickets</Text>
              <Text style={styles.infoValue}>12</Text>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
              <Text style={styles.infoLabel}>Registered Machines</Text>
              <Text style={styles.infoValue}>5</Text>
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
});

export default PersonalInformationScreen;

