// import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native'
// import React, { useState } from 'react'
// import Icon from 'react-native-vector-icons/Ionicons'
// import { darkgrayColor, whiteColor, lightGrayColor, lightPinkAccent, grayColor, supportGreen, supportGold, supportBlue, redColor, lightColor, lightBlack } from '../constans/Color'
// import { style, spacings } from '../constans/Fonts'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { BaseStyle } from '../constans/Style'
// const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween, alignItemsFlexStart } = BaseStyle;

// const NotificationsScreen = () => {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: 'Ticket Update',
//       description: 'Your support ticket #EXP12345 has been resolved by our technical team.',
//       timestamp: '2 hours ago',
//       isUnread: true,
//       icon: 'checkmark',
//       iconColor: supportGreen,
//     },
//     {
//       id: 2,
//       title: 'Maintenance Reminder',
//       description: 'Scheduled maintenance for Machine Model XR-2000 is due this week.',
//       timestamp: '5 hours ago',
//       isUnread: true,
//       icon: 'time',
//       iconColor: supportGold,
//     },
//     {
//       id: 3,
//       title: 'New Expert Available',
//       description: 'A machinery expert is now available for live chat support.',
//       timestamp: '1 day ago',
//       isUnread: false,
//       icon: 'information',
//       iconColor: supportBlue,
//     },
//     {
//       id: 4,
//       title: 'App Update Available',
//       description: 'Version 2.1.0 is now available with improved chat features.',
//       timestamp: '2 days ago',
//       isUnread: true,
//       icon: 'information',
//       iconColor: supportBlue,
//     },
//     {
//       id: 5,
//       title: 'Critical Alert',
//       description: 'Urgent: Safety inspection required for Equipment Serial #ABC123.',
//       timestamp: '3 days ago',
//       isUnread: false,
//       icon: 'warning',
//       iconColor: redColor,
//     },
//   ])

//   const unreadCount = notifications.filter(notification => notification.isUnread).length

//   const markAllAsRead = () => {
//     setNotifications(prevNotifications =>
//       prevNotifications.map(notification => ({
//         ...notification,
//         isUnread: false
//       }))
//     )
//   }

//   const markAsRead = (id) => {
//     setNotifications(prevNotifications =>
//       prevNotifications.map(notification =>
//         notification.id === id
//           ? { ...notification, isUnread: false }
//           : notification
//       )
//     )
//   }

//   const deleteNotification = (id) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setNotifications(prevNotifications =>
//               prevNotifications.filter(notification => notification.id !== id)
//             )
//           }
//         }
//       ]
//     )
//   }

//  const renderNotificationItem = ({ item }) => (
//   <TouchableOpacity style={styles.notificationCard} activeOpacity={0.8}>
//     <View
//       style={[
//         flexDirectionRow,
//         alignItemsFlexStart,
//         { padding: spacings.large },
//         item.isUnread && { borderLeftWidth: 4, borderLeftColor:lightPinkAccent,borderTopLeftRadius:10 ,borderBottomLeftRadius:10}, // gold strip for unread
//       ]}
//     >
//       <View
//         style={[
//           styles.iconContainer,
//           { backgroundColor: item.iconColor + 20 },
//           alignJustifyCenter,
//         ]}
//       >
//         <Icon name={item.icon} size={20} color={whiteColor} />
//       </View>

//       <View style={styles.notificationTextContainer}>
//         <View style={[styles.titleContainer, flexDirectionRow, alignItemsCenter]}>
//           <Text style={styles.notificationTitle}>{item.title}</Text>
//           {item.isUnread && <View style={styles.unreadDot} />}
//         </View>
//         <Text style={styles.notificationDescription}>{item.description}</Text>
//         <Text style={styles.timestamp}>{item.timestamp}</Text>
//       </View>

//       <View style={[styles.actionButtons, flexDirectionRow, alignItemsCenter]}>
//         {item.isUnread && (
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => markAsRead(item.id)}
//           >
//             <Icon name="checkmark" size={20} color={whiteColor} />
//           </TouchableOpacity>
//         )}
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => deleteNotification(item.id)}
//         >
//           <Icon name="trash-outline" size={20} color={lightPinkAccent} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   </TouchableOpacity>
// );


//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={[styles.headerTop, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
//           <Text style={styles.headerTitle}>Notifications</Text>
//           <View style={[flexDirectionRow, alignItemsCenter]}>
//             <View style={styles.unreadBadge}>
//               <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
//             </View>
//             <TouchableOpacity style={styles.settingsButton}>
//               <Icon name="settings-outline" size={24} color={whiteColor} />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <Text style={styles.unreadText}>{unreadCount} unread notifications</Text>
//         <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
//           <Icon name="checkmark" size={20} color={whiteColor} />
//           <Text style={styles.markAllText}>Mark All as Read</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Notifications List */}
//       <FlatList
//         data={notifications}
//         renderItem={renderNotificationItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.notificationsList}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   )
// }

// export default NotificationsScreen

// const styles = StyleSheet.create({
//   container: {
//     width: wp(100),
//     height: hp(90),
//     backgroundColor: lightColor,
//     padding: spacings.large
//   },
//   header: {
//     paddingBottom: spacings.large,
//   },
//   headerTop: {
//     marginBottom: spacings.small,
//   },
//   headerTitle: {
//     ...style.fontSizeLargeX,
//     ...style.fontWeightThin1x,
//     color: whiteColor,
//   },
//   unreadBadge: {
//     backgroundColor: lightPinkAccent,
//     borderRadius: 12,
//     minWidth: 24,
//     height: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: spacings.medium,
//   },
//   unreadBadgeText: {
//     color: whiteColor,
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   settingsButton: {
//     padding: spacings.small,
//   },
//   unreadText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: grayColor,
//     marginBottom: spacings.medium,
//   },
//   markAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   markAllText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightMedium,
//     color: whiteColor,
//     marginLeft: spacings.small,
//   },
//   notificationsList: {
//     paddingBottom: spacings.xxLarge,
//   },
//   notificationCard: {
//     backgroundColor: lightBlack,
//     borderRadius: 12,
//     marginBottom: spacings.medium,
//     // padding: spacings.large,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   iconContainer: {
//     width: wp(10),
//     height: wp(10),
//     borderRadius: 10,
//     marginRight: spacings.large,
//   },
//   notificationTextContainer: {
//     flex: 1,
//   },
//   titleContainer: {
//     marginBottom: spacings.xsmall,
//   },
//   notificationTitle: {
//     ...style.fontSizeNormal2x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginRight: spacings.small,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: lightPinkAccent,
//   },
//   notificationDescription: {
//     ...style.fontSizeSmall2x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     opacity: 0.8,
//     lineHeight: 20,
//     marginBottom: spacings.xsmall,
//   },
//   timestamp: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: grayColor,
//   },
//   actionButtons: {
//     marginLeft: spacings.medium,
//   },
//   actionButton: {
//     padding: spacings.small,
//     marginLeft: spacings.small,
//   },
// })

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NotificationsScreen = () => {
  return (
    <View>
      <Text>NotificationsScreen</Text>
    </View>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({})