// import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, FlatList, Platform } from 'react-native'
// import React, { useState } from 'react'
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import ConfirmationModal from '../components/Modals/ConfirmationModal'
// import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightPinkAccent, supportBlue, redColor, supportGreen, lightColor, lightBlack } from '../constans/Color'
// import { style, spacings } from '../constans/Fonts'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { BaseStyle } from '../constans/Style'
// import { CommonActions } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

// const AccountScreen = ({ navigation }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalConfig, setModalConfig] = useState({});

//   const accountOptions = [
//     {
//       id: 1,
//       title: 'Personal Information',
//       subtitle: 'Edit profile details',
//       icon: 'user',
//       iconColor: supportBlue,
//       iconType: Feather,
//       onPress: () => navigation.navigate('PersonalInformation'),
//     },
//     {
//       id: 2,
//       title: 'Delete Account',
//       subtitle: 'Permanently remove account',
//       icon: 'trash-outline',
//       iconColor: redColor,
//       iconType: Ionicons,
//       onPress: () => handleDeleteAccount(),
//     },
//     {
//       id: 3,
//       title: 'Report an Issue',
//       subtitle: 'Submit feedback',
//       icon: 'warning-outline',
//       iconColor: redColor,
//       iconType: Ionicons,
//       onPress: () => console.log('Report an Issue pressed'),
//     },
//     {
//       id: 4,
//       title: 'Privacy Policy and Terms',
//       subtitle: 'View policies and conditions',
//       icon: 'shield-checkmark-outline',
//       iconColor: supportGreen,
//       iconType: Ionicons,
//       onPress: () => console.log('Privacy Policy pressed'),
//     },
//     {
//       id: 5,
//       title: 'Sign Out',
//       subtitle: 'Logout from account',
//       icon: 'log-out-outline',
//       iconColor: redColor,
//       iconType: Ionicons,
//       onPress: () => handleSignOut(),
//     },
//   ]

//   const handleDeleteAccount = () => {
//     setModalConfig({
//       title: 'Delete Account',
//       message: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
//       confirmText: 'Delete',
//       cancelText: 'Cancel',
//       type: 'danger',
//       iconName: 'trash-outline',
//       onConfirm: async () => {
//         try {
//           // Here you would typically call your API to delete the account
//           // For now, we'll just clear the local data and logout
//           console.log('Account deletion request sent to server');

//           // Clear user token and data from AsyncStorage
//           await AsyncStorage.removeItem('userToken');
//           await AsyncStorage.removeItem('userData');
//           console.log('Account deleted and user logged out');
//           setModalVisible(false);
//           // The AppNavigator will automatically detect the token removal and redirect to login
//         } catch (error) {
//           console.log('Delete account error:', error);
//           setModalVisible(false);
//         }
//       }
//     });
//     setModalVisible(true);
//   }

//   const handleSignOut = () => {
//     setModalConfig({
//       title: 'Sign Out',
//       message: 'Are you sure you want to sign out?',
//       confirmText: 'Sign Out',
//       cancelText: 'Cancel',
//       type: 'warning',
//       iconName: 'log-out-outline',
//       onConfirm: async () => {
//         try {
//           // Clear user token from AsyncStorage
//           await AsyncStorage.removeItem('userToken');
//           // Clear any other user data if needed
//           await AsyncStorage.removeItem('userData');
//           console.log('User signed out successfully')
//           navigation.dispatch(
//             CommonActions.reset({
//               index: 0,
//               routes: [{ name: 'Login' }],
//             })
//           );
//           setModalVisible(false);
//         } catch (error) {
//           console.log('Logout error:', error);
//           setModalVisible(false);
//         }
//       }
//     });
//     setModalVisible(true);
//   }

//   const closeModal = () => {
//     setModalVisible(false);
//   }

//   const renderAccountOption = ({ item }) => (
//     <TouchableOpacity
//       style={styles.optionCard}
//       onPress={item.onPress}
//       activeOpacity={0.8}
//     >
//       <View style={[styles.optionContent, flexDirectionRow, alignItemsCenter]}>
//         <View style={[styles.optionIcon, alignJustifyCenter, { backgroundColor: item.iconColor + 30 }]}>
//           <item.iconType name={item.icon} size={20} color={whiteColor} />
//         </View>
//         <View style={styles.optionText}>
//           <Text style={styles.optionTitle}>{item.title}</Text>
//           <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
//         </View>
//         <Ionicons name="chevron-forward-outline" size={20} color={whiteColor} />
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView style={[styles.container, { padding: spacings.xLarge, }]} showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={[styles.header, alignItemsCenter]}>
//           <Text style={styles.headerTitle}>My Profile</Text>
//           <Text style={styles.headerSubtitle}>Manage your account settings</Text>
//         </View>

//         {/* User Profile Card */}
//         <View style={[styles.profileCard, alignItemsCenter]}>
//           <View style={styles.avatarContainer}>
//             <View style={[styles.avatar, alignJustifyCenter]}>
//               <Feather name="user" size={40} color={whiteColor} />
//             </View>
//           </View>
//           <Text style={styles.userName}>John Smith</Text>
//           <Text style={styles.membershipStatus}>Premium Member</Text>

//           <View style={[styles.statsContainer, flexDirectionRow, justifyContentSpaceBetween]}>
//             <View style={[alignItemsCenter]}>
//               <Text style={styles.statNumber}>12</Text>
//               <Text style={styles.statLabel}>Tickets</Text>
//             </View>
//             <View style={[alignItemsCenter]}>
//               <Text style={styles.statNumber}>3</Text>
//               <Text style={styles.statLabel}>Years</Text>
//             </View>
//             <View style={[alignItemsCenter]}>
//               <Text style={styles.statNumber}>5</Text>
//               <Text style={styles.statLabel}>Machines</Text>
//             </View>
//           </View>
//         </View>

//         {/* Account Options */}
//         <View style={styles.optionsContainer}>
//           <FlatList
//             data={accountOptions}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderAccountOption}
//             showsVerticalScrollIndicator={false}
//           />
//         </View>

//         {/* Confirmation Modal */}
//         <ConfirmationModal
//           visible={modalVisible}
//           onClose={closeModal}
//           onConfirm={modalConfig.onConfirm}
//           title={modalConfig.title}
//           message={modalConfig.message}
//           confirmText={modalConfig.confirmText}
//           cancelText={modalConfig.cancelText}
//           type={modalConfig.type}
//           iconName={modalConfig.iconName}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default AccountScreen

// const styles = StyleSheet.create({
//   container: {
//     width: wp(100),
//     height: Platform.OS === "ios" ? hp(92) : hp(90),
//     backgroundColor: lightColor,
//   },
//   header: {
//     paddingBottom: spacings.large,
//   },
//   headerTitle: {
//     fontSize: style.fontSizeLarge.fontSize,
//     fontWeight: style.fontWeightThin1x.fontWeight,
//     color: whiteColor,
//     marginBottom: spacings.small,
//   },
//   headerSubtitle: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//   },
//   profileCard: {
//     backgroundColor: lightBlack,
//     borderRadius: 12,
//     marginBottom: spacings.xxLarge,
//     padding: spacings.xxLarge,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   avatarContainer: {
//     marginBottom: spacings.large,
//   },
//   avatar: {
//     width: wp(22),
//     height: Platform.OS === "ios" ? hp(10) : hp(11),
//     borderRadius: 50,
//     backgroundColor: lightPinkAccent,
//   },
//   userName: {
//     ...style.fontSizeLarge1x,
//     ...style.fontWeightBold,
//     color: whiteColor,
//     marginBottom: spacings.small,
//   },
//   membershipStatus: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.xxLarge,
//   },
//   statsContainer: {
//     width: '100%',
//   },
//   statNumber: {
//     ...style.fontSizeLarge1x,
//     ...style.fontWeightBold,
//     color: whiteColor,
//     marginBottom: spacings.xsmall,
//   },
//   statLabel: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//   },
//   optionsContainer: {
//     paddingBottom: spacings.xxLarge,
//   },
//   optionCard: {
//     backgroundColor: lightBlack,
//     borderRadius: 12,
//     marginBottom: spacings.medium,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   optionContent: {
//     padding: spacings.large,
//   },
//   optionIcon: {
//     width: wp(12),
//     height: hp(6),
//     borderRadius: 10,
//     marginRight: spacings.large,
//   },
//   optionText: {
//     flex: 1,
//   },
//   optionTitle: {
//     ...style.fontSizeNormal2x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.xsmall,
//   },
//   optionSubtitle: {
//     ...style.fontSizeSmall,
//     ...style.fontWeightThin,
//     color: whiteColor,
//   },
// })


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AccountScreen = () => {
  return (
    <View>
      <Text>AccountScreen</Text>
    </View>
  )
}

export default AccountScreen

const styles = StyleSheet.create({})