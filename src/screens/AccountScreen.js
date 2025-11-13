import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, FlatList, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ConfirmationModal from '../components/Modals/ConfirmationModal'
import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightPinkAccent, supportBlue, redColor, supportGreen, lightColor, lightBlack } from '../constans/Color'
import { style, spacings } from '../constans/Fonts'
import { widthPercentageToDP as wp, heightPercentageToDP as hp, fetchWithAuth } from '../utils';
import { BaseStyle } from '../constans/Style'
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ENDPOINTS } from '../constans/Constants'
const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;
import { getSocket } from '../socket/socket';

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

const AccountScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        let normalizedRole = null;
        if (storedRole) {
          try {
            normalizedRole = JSON.parse(storedRole);
          } catch {
            normalizedRole = storedRole;
          }
        }
        setUserRole(
          typeof normalizedRole === 'string'
            ? normalizedRole.toLowerCase()
            : null,
        );
      } catch (error) {
        console.log('Error loading user role on Account screen:', error);
        setUserRole(null);
      }
    };

    loadRole();
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      setProfileError('');

      // Using fetchWithAuth - automatically handles token and auth errors
      const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/profile`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log('Profile API Response:', data);

      if (response.ok) {
        const customer = data?.data?.customer || data?.customer || data?.data || data;
        setProfileData(customer);
        await AsyncStorage.setItem('userData', JSON.stringify(customer));
      } else {
        // If response not ok and auth error, fetchWithAuth already handled logout
        const errorMsg = data?.message || data?.error || 'Unable to fetch profile at the moment.';
        setProfileError(errorMsg);
        setProfileData(null);
      }
    } catch (error) {
      console.log('Profile fetch error:', error);
      setProfileError('Unable to load profile. Please check your connection.');
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      fetchProfile()
    }, [fetchProfile])
  )

  const rawDisplayName = profileData?.name || profileData?.fullName || 'Customer'
  const displayName = formatDisplayName(rawDisplayName) || 'Customer'
  // const totalTickets = profileData ? (profileData?.totalSupportTickets ?? profileData?.totalTickets ?? 12) : 12
  // const membershipDuration = profileData
  //   ? calculateMembershipDuration(profileData?.memberSince, profileData?.createdAt)
  //   : { value: 3, label: 'Years' }
  // const customerStatus = profileData?.status

  const accountOptions = [
    {
      id: 1,
      title: 'Personal Information',
      subtitle: 'Edit profile details',
      icon: 'user',
      iconColor: supportBlue,
      iconType: Feather,
      onPress: () => navigation.navigate('PersonalInformation'),
    },
    {
      id: 2,
      title: 'Delete Account',
      subtitle: 'Permanently remove account',
      icon: 'trash-outline',
      iconColor: redColor,
      iconType: Ionicons,
      onPress: () => handleDeleteAccount(),
    },
    userRole === 'customer' && {
      id: 3,
      title: 'Report and Issue',
      subtitle: 'Submit a report or issue',
      icon: 'warning-outline',
      iconColor: redColor,
      iconType: Ionicons,
      onPress: () => navigation.navigate('ReportAndIssue'),
    },
    {
      id: 4,
      title: 'Privacy Policy and Terms',
      subtitle: 'View policies and conditions',
      icon: 'shield-checkmark-outline',
      iconColor: supportGreen,
      iconType: Ionicons,
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 5,
      title: 'Sign Out',
      subtitle: 'Logout from account',
      icon: 'log-out-outline',
      iconColor: redColor,
      iconType: Ionicons,
      onPress: () => handleSignOut(),
    },
  ]

  const handleDeleteAccount = () => {
    setModalConfig({
      title: 'Delete Account',
      message: 'Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your data,support tickets,and preferences.',
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
      type: 'danger',
      iconName: 'trash-outline',
      onConfirm: async () => {
        try {
          setModalVisible(false);

          // Using fetchWithAuth - automatically handles token and auth errors
          const response = await fetchWithAuth(`${API_ENDPOINTS.BASE_URL}/api/app/profile/delete-account`, {
            method: 'DELETE',
          });

          const data = await response.json();
          console.log('Delete Account Response:', data);

          if (response.ok) {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'userRole']);
            navigation.navigate('Auth');
            setModalVisible(false);
          } else {
            // If response not ok and auth error, fetchWithAuth already handled logout
            const errorMsg = data?.message || data?.error || 'Unable to delete account. Please try again.';
            console.log('Delete Account Response Error:', errorMsg);
            setModalVisible(false);
          }
        } catch (error) {
          console.log('Delete Account Error:', error);
        }
      }
    });
    setModalVisible(true);
  }

  const handleSignOut = () => {
    setModalConfig({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      type: 'warning',
      iconName: 'log-out-outline',
      onConfirm: async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const userData = await AsyncStorage.getItem('userData');
          const user = userData ? JSON.parse(userData) : null;

          const socket = getSocket();

          // ✅ Step 1: Emit user_offline before logging out
          if (socket && user) {
            console.log('📴 Emitting user_offline...');
            socket.emit('user_offline', {
              userId: user.id,
              userEmail: user.email,
              userName: user.name,
              role: user.role,
            });
            socket.disconnect();
            console.log('❌ Socket disconnected on logout');
          }

          // ✅ Step 2: Hit Logout API (optional)
          if (token) {
            try {
              const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/app/auth/logout`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              const responseBody = await response.json().catch(() => null);
              console.log('Logout API Response:', responseBody);
            } catch (apiError) {
              console.log('Logout API Error:', apiError);
            }
          } else {
            console.log('Logout skipped: token not found.');
          }

          await AsyncStorage.multiRemove(['userToken', 'userData', 'userRole']);
          console.log('User signed out successfully');
          navigation.navigate('Auth');
          setModalVisible(false);
        } catch (error) {
          console.log('Logout error:', error);
          setModalVisible(false);
        }
      }
    });
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const renderAccountOption = ({ item }) => (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.optionContent, flexDirectionRow, alignItemsCenter]}>
        <View style={[styles.optionIcon, alignJustifyCenter, { backgroundColor: item.iconColor + 30 }]}>
          <item.iconType name={item.icon} size={20} color={whiteColor} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{item.title}</Text>
          <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color={whiteColor} />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={[styles.container, { padding: spacings.xLarge, }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, alignItemsCenter]}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account settings</Text>
        </View>


        {/* User Profile Card */}
        <View style={[styles.profileCard, alignItemsCenter]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, alignJustifyCenter]}>
              <Feather name="user" size={40} color={whiteColor} />
            </View>
          </View>

          {profileLoading ? (
            <ActivityIndicator size="small" color={whiteColor} />
          ) : (
            <>
              <Text style={styles.userName}>{displayName}</Text>

              {/* <View style={[styles.statsContainer, flexDirectionRow, justifyContentSpaceBetween]}>
                <View style={[alignItemsCenter]}>
                  <Text style={styles.statNumber}>{totalTickets}</Text>
                  <Text style={styles.statLabel}>Tickets</Text>
                </View>
                <View style={[alignItemsCenter]}>
                  <Text style={styles.statNumber}>{membershipDuration.value}</Text>
                  <Text style={styles.statLabel}>{membershipDuration.label}</Text>
                </View>
                <View style={[alignItemsCenter]}>
                  <Text style={styles.statNumber}>{formatDisplayName(customerStatus)}</Text>
                  <Text style={styles.statLabel}>Status</Text>
                </View>
              </View> */}
            </>
          )}
        </View>

        {/* Account Options */}
        <View style={styles.optionsContainer}>
          <FlatList
            data={accountOptions.filter(Boolean)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAccountOption}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Confirmation Modal */}
        <ConfirmationModal
          visible={modalVisible}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          type={modalConfig.type}
          iconName={modalConfig.iconName}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default AccountScreen

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: Platform.OS === "ios" ? hp(92) : hp(90),
    backgroundColor: lightColor,
  },
  header: {
    paddingBottom: spacings.large,
  },
  headerTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  headerSubtitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  profileCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    marginBottom: spacings.xxLarge,
    padding: spacings.xxLarge,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: spacings.large,
  },
  avatar: {
    width: wp(22),
    height: Platform.OS === "ios" ? hp(10) : hp(11),
    borderRadius: 50,
    backgroundColor: lightPinkAccent,
  },
  userName: {
    ...style.fontSizeLarge1x,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  membershipStatus: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.xxLarge,
  },
  statsContainer: {
    width: '100%',
  },
  statNumber: {
    ...style.fontSizeLarge1x,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginBottom: spacings.xsmall,
  },
  statLabel: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  optionsContainer: {
    paddingBottom: spacings.xxLarge,
  },
  optionCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    marginBottom: spacings.medium,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    padding: spacings.large,
  },
  optionIcon: {
    width: wp(12),
    height: hp(6),
    borderRadius: 10,
    marginRight: spacings.large,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...style.fontSizeNormal2x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.xsmall,
  },
  optionSubtitle: {
    ...style.fontSizeSmall,
    ...style.fontWeightThin,
    color: whiteColor,
  },
})


