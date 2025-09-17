// import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Platform } from 'react-native'
// import React, { useState } from 'react'
// import Icon from 'react-native-vector-icons/Ionicons'
// import { darkgrayColor, whiteColor, lightGrayColor, lightPinkAccent, grayColor, lightBlack, lightColor } from '../constans/Color'
// import { style, spacings } from '../constans/Fonts'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
// import { BaseStyle } from '../constans/Style'
// const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter } = BaseStyle;

// const InboxScreen = () => {
//   const [activeTab, setActiveTab] = useState('All')
//   const [searchText, setSearchText] = useState('')

//   const messages = [
//     {
//       id: 1,
//       title: 'CNC calibration issue',
//       sender: 'Support Team',
//       message: 'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
//       timestamp: '2 hours ago',
//       isUnread: false,
//       iconColor: "transparent",
//     },
//     {
//       id: 2,
//       title: 'Software license activation',
//       sender: 'Support Team',
//       message: 'Let me check the license key in our system. I\'ll get back to you within 24...',
//       timestamp: '1 day ago',
//       isUnread: true,
//       iconColor: lightPinkAccent,
//     },
//     {
//       id: 3,
//       title: 'Replacement spindle bearing',
//       sender: 'Support Team',
//       message: 'We\'ve received your parts request and are preparing a quote. You should receive it by...',
//       timestamp: '3 days ago',
//       isUnread: false,
//       iconColor: "transparent",
//     },
//     {
//       id: 4,
//       title: 'Maintenance schedule query',
//       sender: 'Support Team',
//       message: 'Thank you for the detailed maintenance schedule. This will help us plan our...',
//       timestamp: '1 week ago',
//       isUnread: false,
//       iconColor: "transparent",
//     },
//     {
//       id: 5,
//       title: 'CNC calibration issue',
//       sender: 'Support Team',
//       message: 'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
//       timestamp: '2 hours ago',
//       isUnread: false,
//       iconColor: "transparent",
//     },
//     {
//       id: 6,
//       title: 'Software license activation',
//       sender: 'Support Team',
//       message: 'Let me check the license key in our system. I\'ll get back to you within 24...',
//       timestamp: '1 day ago',
//       isUnread: true,
//       iconColor: lightPinkAccent,
//     },
//   ]

//   const tabs = [
//     { id: 'All', label: 'All' },
//     { id: 'Unread', label: 'Unread', badge: 1 },
//     { id: 'Archived', label: 'Archived' },
//   ]

//   const emptyMessages = {
//     All: {
//       title: "No messages found",
//       description: "Your inbox is empty",
//       icon: "mail-outline"
//     },
//     Unread: {
//       title: "No unread messages",
//       description: "You’re all caught up",
//       icon: "mail-unread-outline"
//     },
//     Archived: {
//       title: "No archived messages",
//       description: "Messages you archive will appear here",
//       icon: "archive-outline"
//     }
//   }

//   const filteredMessages = messages.filter((msg) => {
//     if (activeTab === 'Unread') return msg.isUnread
//     if (activeTab === 'Archived') return msg.isArchived
//     return true
//   }).filter((msg) =>
//     msg.title.toLowerCase().includes(searchText.toLowerCase()) ||
//     msg.message.toLowerCase().includes(searchText.toLowerCase())
//   )
//   const renderMessageItem = ({ item }) => (
//     <TouchableOpacity style={styles.messageCard} activeOpacity={0.8}>
//       <View style={styles.messageContent}>
//         <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
//           <Icon name="settings-outline" size={20} color={whiteColor} />
//         </View>
//         <View style={styles.messageTextContainer}>
//           <Text style={styles.messageTitle}>{item.title}</Text>
//           <Text style={styles.messageSender}>{item.sender}</Text>
//           <Text style={styles.messagePreview} numberOfLines={2}>
//             {item.message}
//           </Text>
//         </View>
//         <View style={styles.messageMeta}>
//           <Text style={styles.timestamp}>{item.timestamp}</Text>
//           {item.isUnread && <View style={styles.unreadDot} />}
//         </View>
//       </View>
//     </TouchableOpacity>
//   )

//   const renderTab = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.tab,
//         activeTab === item.id && styles.activeTab,
//         alignJustifyCenter,
//         flexDirectionRow
//       ]}
//       onPress={() => setActiveTab(item.id)}
//     >
//       <Text style={[
//         styles.tabText,
//         activeTab === item.id && styles.activeTabText
//       ]}>
//         {item.label}
//       </Text>
//       {item.badge && (
//         <View style={[styles.tabBadge, alignJustifyCenter]}>
//           <Text style={styles.tabBadgeText}>{item.badge}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   )

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Support Inbox</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchBar}>
//         <Icon name="search" size={20} color={grayColor} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search conversations"
//           placeholderTextColor={grayColor}
//           value={searchText}
//           onChangeText={setSearchText}
//         />
//       </View>

//       {/* Filter Tabs */}
//       <View style={[styles.tabsContainer]}>
//         <FlatList
//           data={tabs}
//           renderItem={renderTab}
//           keyExtractor={(item) => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>

//       {/* Instruction Text */}
//       <View style={styles.instructionContainer}>
//         <Text style={styles.instructionText}>Swipe left to archive messages</Text>
//       </View>

//       {/* Messages List */}
//       {filteredMessages.length > 0 ? (
//         <FlatList
//           data={filteredMessages}
//           renderItem={renderMessageItem}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.messagesList}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <Icon name={emptyMessages[activeTab].icon} size={50} color={grayColor} />
//           <Text style={{ color: whiteColor, marginTop: 10, fontSize: 16, fontWeight: "600" }}>
//             {emptyMessages[activeTab].title}
//           </Text>
//           <Text style={{ color: grayColor, marginTop: 4, fontSize: 14 }}>
//             {emptyMessages[activeTab].description}
//           </Text>
//         </View>
//       )}
//     </View>
//   )
// }

// export default InboxScreen

// const styles = StyleSheet.create({
//   container: {
//     width: wp(100),
//     height: hp(90),
//     backgroundColor: lightColor,
//     padding: spacings.large
//   },
//   header: {
//     paddingHorizontal: spacings.xxLarge,
//     paddingTop: spacings.xxLarge,
//     paddingBottom: spacings.large,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     ...style.fontSizeLargeX,
//     ...style.fontWeightThin1x,
//     color: whiteColor,
//   },

//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: lightBlack,
//     borderRadius: 5,
//     paddingHorizontal: spacings.large,
//     paddingVertical: Platform.OS === 'ios' ? spacings.medium : 0,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: spacings.medium,
//     color: whiteColor,
//     fontSize: 16,
//   },
//   tabsContainer: {
//     backgroundColor: lightBlack,
//     borderRadius: 5,
//     marginTop: spacings.xLarge,
//   },
//   tab: {
//     paddingVertical: spacings.medium,
//     marginRight: spacings.medium,
//     width: wp(30.2),
//     height: hp(6),
//     borderRadius: 5,
//   },
//   activeTab: {
//     backgroundColor: lightPinkAccent,
//   },
//   tabText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightMedium,
//     color: whiteColor,
//   },
//   activeTabText: {
//     color: whiteColor,
//   },
//   tabBadge: {
//     backgroundColor: "red",
//     borderRadius: 10,
//     minWidth: wp(5),
//     height: wp(5),
//     position: "absolute",
//     right: 1,
//     top: 1,
//     paddingHorizontal: 3,

//   },
//   tabBadgeText: {
//     color: whiteColor,
//     fontSize: style.fontSizeSmall1x.fontSize,
//     fontWeight: style.fontWeightBold.fontWeight,
//   },
//   instructionContainer: {
//     paddingBottom: spacings.large,
//     marginTop: spacings.xxxxLarge
//   },
//   instructionText: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//   },
//   messagesList: {
//     paddingBottom: spacings.xxLarge,
//   },
//   messageCard: {
//     backgroundColor: lightBlack,
//     borderRadius: 12,
//     marginBottom: spacings.medium,
//     padding: spacings.large,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   messageContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: spacings.large,
//   },
//   messageTextContainer: {
//     flex: 1,
//   },
//   messageTitle: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.xsmall,
//   },
//   messageSender: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.xsmall,
//   },
//   messagePreview: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     opacity: 0.8,
//     lineHeight: 20,
//   },
//   messageMeta: {
//     alignItems: 'flex-end',
//     marginLeft: spacings.medium,
//   },
//   timestamp: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.xsmall,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: lightPinkAccent,
//   },
// })


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InboxScreen = () => {
  return (
    <View>
      <Text>InboxScreen</Text>
    </View>
  )
}

export default InboxScreen

const styles = StyleSheet.create({})