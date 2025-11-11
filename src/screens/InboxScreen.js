// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   Platform,
//   Pressable,
//   Modal,
// } from 'react-native';
// import React, { useState } from 'react';
// import Icon from 'react-native-vector-icons/Ionicons';
// import {
//   darkgrayColor,
//   whiteColor,
//   lightGrayColor,
//   lightPinkAccent,
//   grayColor,
//   lightBlack,
//   lightColor,
//   greenColor,
// } from '../constans/Color';
// import { style, spacings } from '../constans/Fonts';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from '../utils';
// import { BaseStyle } from '../constans/Style';
// import { SafeAreaView } from 'react-native-safe-area-context';
// const {
//   flex,
//   alignJustifyCenter,
//   flexDirectionRow,
//   alignItemsCenter,
//   justifyContentSpaceBetween,
// } = BaseStyle;

// const InboxScreen = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState('All');
//   const [searchText, setSearchText] = useState('');
//   const [showTicketModal, setShowTicketModal] = useState(false);
//   const [ticket, setTicket] = useState();
//   console.log('ticketticket', ticket);

//   const messages = [
//     {
//       id: 1,
//       title: 'CNC calibration issue',
//       sender: 'Support Team',
//       message:
//         'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
//       timestamp: '2 hours ago',
//       isUnread: false,
//       iconColor: 'transparent',
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//       status: 'Resolved',
//     },
//     {
//       id: 2,
//       title: 'Software license activation',
//       sender: 'Support Team',
//       message:
//         "Let me check the license key in our system. I'll get back to you within 24...",
//       timestamp: '1 day ago',
//       isUnread: true,
//       status: 'In Progress',
//       iconColor: lightPinkAccent,
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//     },
//     {
//       id: 3,
//       title: 'Replacement spindle bearing',
//       sender: 'Support Team',
//       message:
//         "We've received your parts request and are preparing a quote. You should receive it by...",
//       timestamp: '3 days ago',
//       isUnread: false,
//       status: 'Resolved',
//       iconColor: 'transparent',
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//     },
//     {
//       id: 4,
//       title: 'Maintenance schedule query',
//       sender: 'Support Team',
//       message:
//         'Thank you for the detailed maintenance schedule. This will help us plan our...',
//       timestamp: '1 week ago',
//       isUnread: false,
//       status: 'Resolved',
//       iconColor: 'transparent',
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//     },
//     {
//       id: 5,
//       title: 'CNC calibration issue',
//       sender: 'Support Team',
//       message:
//         'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
//       timestamp: '2 hours ago',
//       isUnread: false,
//       status: 'Resolved',
//       iconColor: 'transparent',
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//     },
//     {
//       id: 6,
//       title: 'Software license activation',
//       sender: 'Support Team',
//       message:
//         "Let me check the license key in our system. I'll get back to you within 24...",
//       timestamp: '1 day ago',
//       isUnread: true,
//       status: 'In Progress',
//       iconColor: lightPinkAccent,
//       machine: 'Genturn 2540',
//       serial: 'GT2540-2023-015',
//       category: 'Applications Support',
//       createdDate: '18/01/2024',
//       description: 'Unable to activate new CAM software license',
//     },
//   ];

//   const tabs = [
//     { id: 'All', label: 'All' },
//     { id: 'Unread', label: 'Unread', badge: 1 },
//     { id: 'Archived', label: 'Archived' },
//   ];

//   const emptyMessages = {
//     All: {
//       title: 'No messages found',
//       description: 'Your inbox is empty',
//       icon: 'mail-outline',
//     },
//     Unread: {
//       title: 'No unread messages',
//       description: 'You’re all caught up',
//       icon: 'mail-unread-outline',
//     },
//     Archived: {
//       title: 'No archived messages',
//       description: 'Messages you archive will appear here',
//       icon: 'archive-outline',
//     },
//   };
//   const getStatusColor = status => {
//     switch (status) {
//       case 'Resolved':
//         return greenColor;
//       case 'In Progress':
//         return '#FFA500';
//       case 'Open':
//         return lightPinkAccent;
//       default:
//         return grayColor;
//     }
//   };

//   const filteredMessages = messages
//     .filter(msg => {
//       if (activeTab === 'Unread') return msg.isUnread;
//       if (activeTab === 'Archived') return msg.isArchived;
//       return true;
//     })
//     .filter(
//       msg =>
//         msg.title.toLowerCase().includes(searchText.toLowerCase()) ||
//         msg.message.toLowerCase().includes(searchText.toLowerCase()),
//     );
//   const renderMessageItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.messageCard}
//       activeOpacity={0.8}
//       onPress={() => {
//         setShowTicketModal(true), setTicket(item);
//       }}
//       // onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
//     >
//       <View style={styles.messageContent}>
//         <View
//           style={[styles.iconContainer, { backgroundColor: item.iconColor }]}
//         >
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
//   );

//   const renderTab = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.tab,
//         activeTab === item.id && styles.activeTab,
//         alignJustifyCenter,
//         flexDirectionRow,
//       ]}
//       onPress={() => setActiveTab(item.id)}
//     >
//       <Text
//         style={[styles.tabText, activeTab === item.id && styles.activeTabText]}
//       >
//         {item.label}
//       </Text>
//       {item.badge && (
//         <View style={[styles.tabBadge, alignJustifyCenter]}>
//           <Text style={styles.tabBadgeText}>{item.badge}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={[styles.container, { padding: spacings.xLarge }]}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Support Inbox</Text>
//         </View>

//         {/* Search Bar */}
//         <View style={styles.searchBar}>
//           <Icon name="search" size={20} color={grayColor} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search conversations"
//             placeholderTextColor={grayColor}
//             value={searchText}
//             onChangeText={setSearchText}
//           />
//         </View>

//         {/* Filter Tabs */}
//         <View style={[styles.tabsContainer]}>
//           <FlatList
//             data={tabs}
//             renderItem={renderTab}
//             keyExtractor={item => item.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>

//         {/* Instruction Text */}
//         <View style={styles.instructionContainer}>
//           <Text style={styles.instructionText}>
//             Swipe left to archive messages
//           </Text>
//         </View>

//         {/* Messages List */}
//         {filteredMessages.length > 0 ? (
//           <FlatList
//             data={filteredMessages}
//             renderItem={renderMessageItem}
//             keyExtractor={item => item.id.toString()}
//             contentContainerStyle={styles.messagesList}
//             showsVerticalScrollIndicator={false}
//           />
//         ) : (
//           <View
//             style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//           >
//             <Icon
//               name={emptyMessages[activeTab].icon}
//               size={50}
//               color={grayColor}
//             />
//             <Text
//               style={{
//                 color: whiteColor,
//                 marginTop: 10,
//                 fontSize: 16,
//                 fontWeight: '600',
//               }}
//             >
//               {emptyMessages[activeTab].title}
//             </Text>
//             <Text style={{ color: grayColor, marginTop: 4, fontSize: 14 }}>
//               {emptyMessages[activeTab].description}
//             </Text>
//           </View>
//         )}
//       </View>
//       {/* // Ticket Details Modal */}
//       <Modal
//         visible={showTicketModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowTicketModal(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'rgba(0,0,0,0.5)',
//             justifyContent: 'center',
//             paddingHorizontal: spacings.large,
//           }}
//         >
//           <View style={[styles.detailsCard, { margin: 0 }]}>
//             {/* Close Button */}
//             <Pressable
//               style={{ alignSelf: 'flex-end', marginBottom: spacings.medium }}
//               onPress={() => setShowTicketModal(false)}
//             >
//               <Icon name="close" size={24} color={whiteColor} />
//             </Pressable>

//             {/* Ticket Details content (keep same as your current detailsCard) */}
//             <View
//               style={[
//                 styles.statusRow,
//                 flexDirectionRow,
//                 alignItemsCenter,
//                 justifyContentSpaceBetween,
//               ]}
//             >
//               <View
//                 style={[
//                   styles.statusBadge,
//                   { backgroundColor: getStatusColor(ticket?.status) },
//                 ]}
//               >
//                 <Text style={styles.statusText}>{ticket?.status}</Text>
//               </View>
//               <Text style={styles.updatedDate}>
//                 Updated {ticket?.updatedDate}
//               </Text>
//             </View>

//             <View style={styles.detailsGrid}>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Machine:</Text>
//                 <Text style={styles.detailValue}>{ticket?.machine}</Text>
//               </View>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Serial:</Text>
//                 <Text style={styles.detailValue}>{ticket?.serial}</Text>
//               </View>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Category:</Text>
//                 <Text style={styles.detailValue}>{ticket?.category}</Text>
//               </View>
//               <View style={styles.detailItem}>
//                 <Text style={styles.detailLabel}>Created:</Text>
//                 <Text style={styles.detailValue}>{ticket?.createdDate}</Text>
//               </View>
//             </View>

//             <View style={styles.descriptionSection}>
//               <Text style={styles.sectionLabel}>Description</Text>
//               <View style={styles.descriptionBox}>
//                 <Text style={styles.descriptionText}>
//                   {ticket?.description}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default InboxScreen;

// const styles = StyleSheet.create({
//   container: {
//     width: wp(100),
//     height: Platform.OS === 'ios' ? hp(88) : hp(90),
//     backgroundColor: lightColor,
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
//     paddingVertical: Platform.OS === 'ios' ? spacings.large : 0,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: spacings.medium,
//     color: whiteColor,
//     fontSize: style.fontSizeNormal.fontSize,
//   },
//   tabsContainer: {
//     backgroundColor: lightBlack,
//     borderRadius: 5,
//     marginTop: spacings.xLarge,
//     padding: spacings.small,
//   },
//   tab: {
//     paddingVertical: spacings.medium,
//     marginRight: spacings.medium,
//     width: wp(29),
//     height: hp(4.5),
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
//     backgroundColor: 'red',
//     borderRadius: 10,
//     minWidth: wp(5),
//     height: wp(5),
//     position: 'absolute',
//     right: 1,
//     top: 0,
//     paddingHorizontal: 3,
//   },
//   tabBadgeText: {
//     color: whiteColor,
//     fontSize: style.fontSizeSmall1x.fontSize,
//     fontWeight: style.fontWeightBold.fontWeight,
//   },
//   instructionContainer: {
//     paddingBottom: spacings.large,
//     marginTop: spacings.xxxxLarge,
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
//     padding: spacings.xLarge,
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
//     width: wp(12),
//     height: hp(5.5),
//     borderRadius: 50,
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
//     marginBottom: spacings.small,
//   },
//   messageSender: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     marginBottom: spacings.small,
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
//   detailsCard: {
//     backgroundColor: lightBlack,
//     margin: spacings.large,
//     borderRadius: 12,
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
//   statusRow: {
//     marginBottom: spacings.large,
//   },
//   statusBadge: {
//     paddingHorizontal: spacings.medium,
//     paddingVertical: spacings.small,
//     borderRadius: 20,
//   },
//   statusText: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightBold,
//     color: whiteColor,
//   },
//   updatedDate: {
//     ...style.fontSizeSmall1x,
//     ...style.fontWeightThin,
//     color: lightGrayColor,
//   },
//   detailsGrid: {
//     marginBottom: spacings.large,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: spacings.small,
//   },
//   detailLabel: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//   },
//   detailValue: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightMedium,
//     color: whiteColor,
//   },
//   descriptionSection: {
//     marginBottom: spacings.large,
//   },
//   resolutionSection: {
//     marginBottom: spacings.small,
//   },
//   sectionLabel: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightBold,
//     color: whiteColor,
//     marginBottom: spacings.small,
//   },
//   descriptionBox: {
//     backgroundColor: lightColor,
//     borderRadius: 8,
//     padding: spacings.medium,
//   },
//   descriptionText: {
//     ...style.fontSizeNormal,
//     ...style.fontWeightThin,
//     color: whiteColor,
//     lineHeight: 20,
//   },
// });

// InboxScreen.js
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateInboxUnreadCount, fetchUnreadCounts } from '../store/slices/unreadCountSlice';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Pressable,
  Modal,
  Animated,
  LayoutAnimation,
  UIManager,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  darkgrayColor,
  whiteColor,
  lightGrayColor,
  lightPinkAccent,
  grayColor,
  lightBlack,
  lightColor,
  greenColor,
} from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  fetchWithAuth,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { API_ENDPOINTS } from '../constans/Constants';

const {
  alignJustifyCenter,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
} = BaseStyle;

// ---- Smooth layout animations (Android enable) ----
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom smoother preset
const SmoothEase = {
  duration: 220,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: { type: LayoutAnimation.Types.easeInEaseOut },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

const InboxScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticket, setTicket] = useState(null);

  // ---- DATA IN STATE (archiving needs state) ----
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // ---- BADGE COUNTS DYNAMIC ----
  const tabs = useMemo(() => {
    const unreadCount = activeTab === 'Archived' ? 0 : messages.filter(m => m.isUnread).length;
    return [
      { id: 'All', label: 'All' },
      {
        id: 'Unread',
        label: 'Unread',
        badge: unreadCount,
      },
      { id: 'Archived', label: 'Archived' },
    ];
  }, [messages, activeTab]);

  const emptyMessages = {
    All: {
      title: 'No messages found',
      description: 'Your inbox is empty',
      icon: 'mail-outline',
    },
    Unread: {
      title: 'No unread messages',
      description: 'You’re all caught up',
      icon: 'mail-unread-outline',
    },
    Archived: {
      title: 'No archived messages',
      description: 'Messages you archive will appear here',
      icon: 'archive-outline',
    },
  };

  const getStatusColor = status => {
    const statusLower = (status || '').toLowerCase();

    switch (statusLower) {
      case 'pending':
        return greenColor;
      case 'resolved':
        return greenColor;
      case 'cancel':
      case 'cancelled':
        return redColor;
      default:
        // Other statuses (In Progress, Open, etc.) → yellow/gold
        return '#FFA500'; // Orange/Yellow
    }
  };

  // ---- ARCHIVE / UNARCHIVE with smooth layout ----
  const handleArchive = async (ticketId) => {
    if (!ticketId) return;

    try {
      // Call API to toggle archive status
      const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${ticketId}/toggle-archive`;
      const response = await fetchWithAuth(url, {
        method: 'PUT',
      });

      const data = await response.json();

      if (response.ok && data?.success) {
        // Update local state - remove from current list (it will move to archived tab)
        LayoutAnimation.configureNext(SmoothEase);
        setMessages(prev => prev.filter(m => m.ticketId !== ticketId));

        // Refresh current tab to get updated data
        loadInbox(true, false);
      } else {
        console.log('Failed to archive ticket:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.log('Archive ticket error:', error);
    }
  };

  // UNARCHIVE - Commented out for now, but keeping for future use
  // const handleUnarchive = async (ticketId) => {
  //   if (!ticketId) return;
  //   
  //   try {
  //     // Call API to toggle archive status (unarchive)
  //     const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${ticketId}/toggle-archive`;
  //     const response = await fetchWithAuth(url, {
  //       method: 'PUT',
  //     });
  //     
  //     const data = await response.json();
  //     
  //     if (response.ok && data?.success) {
  //       // Update local state - remove from archived list
  //       LayoutAnimation.configureNext(SmoothEase);
  //       setMessages(prev => prev.filter(m => m.ticketId !== ticketId));
  //       
  //       // Refresh current tab to get updated data
  //       loadInbox(true, false);
  //     } else {
  //       console.log('Failed to unarchive ticket:', data?.message || 'Unknown error');
  //     }
  //   } catch (error) {
  //     console.log('Unarchive ticket error:', error);
  //   }
  // };

  // ---- FILTERS ----
  const filteredMessages = useMemo(() => {
    // Server-side filtering + search; keep client filtering minimal for safety
    return messages;
  }, [messages]);

  const buildQuery = (resetPage = false) => {
    const q = new URLSearchParams();
    q.set('page', String(resetPage ? 1 : page));
    q.set('limit', '10');
    const filter = activeTab.toLowerCase(); // all | unread | archived
    q.set('filter', filter);
    if (searchText && searchText.trim().length > 0) {
      q.set('search', searchText.trim());
    }
    return q.toString();
  };

  const mapConversations = (items = []) => {
    return items.map((c) => {
      const isUnread = c?.isRead === false;
      // Basic timestamp formatting (fallback to empty)
      let displayTime = null;
      if (c?.lastMessageTime) {
        displayTime = c.lastMessageTime;
      } else if (c?.createdAt) {
        // Fallback to createdAt if lastMessageTime is not available
        displayTime = formatDate(c.createdAt);
      }
      return {
        id: c?._id || String(Math.random()),
        ticketId: c?._id,
        title: c?.title,
        categoryName: c?.categoryId?.name || "",
        sender: 'Expand Support Team',
        message: c?.description || '',
        timestamp: displayTime || '',
        isUnread,
        iconColor: lightPinkAccent,
        status: c?.status || 'pending',
        latestMessage: c?.latestMessage || null, // Include latestMessage for read API
      };
    });
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return '';
    }
  };

  // Mark ticket/message as read
  const markAsRead = async (item) => {
    // Only mark as read if it's unread
    if (!item?.isUnread) return;

    try {
      let url;

      // Check if latestMessage exists
      if (item?.latestMessage?._id) {
        // Call message read API
        url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${item.latestMessage._id}/read`;
      } else if (item?.ticketId) {
        // Call ticket read API
        url = `${API_ENDPOINTS.BASE_URL}/api/app/tickets/${item.ticketId}/read`;
      } else {
        return; // No valid ID found
      }

      const response = await fetchWithAuth(url, { method: 'PUT' });
      const data = await response.json();

      if (response.ok && data?.success) {
        // Update local state to mark as read
        setMessages(prev =>
          prev.map(msg =>
            msg.id === item.id
              ? { ...msg, isUnread: false, iconColor: 'transparent' }
              : msg
          )
        );
      } else {
        console.log('Failed to mark as read:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.log('Mark as read error:', error);
    }
  };

  // Fetch ticket details
  const fetchTicketDetails = async (ticketId) => {
    if (!ticketId || isLoadingDetails) return;

    try {
      setIsLoadingDetails(true);
      setTicketDetails(null);

      const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${ticketId}/details?page=1&limit=20`;
      const response = await fetchWithAuth(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data?.success && data?.data?.ticket) {
        const ticketData = data.data.ticket;
        console.log('ticketData', ticketData);
        console.log('Setting ticketDetails state...');
        setTicketDetails(ticketData);
        console.log('ticketDetails state set');
      } else {
        console.log('Failed to fetch ticket details:', {
          ok: response.ok,
          success: data?.success,
          hasTicket: !!data?.data?.ticket,
          data,
        });
      }
    } catch (error) {
      console.log('Ticket details fetch error:', error);
    } finally {
      console.log('Setting isLoadingDetails to false');
      setIsLoadingDetails(false);
    }
  };

  const loadInbox = async (reset = false, showFullRefresh = false) => {
    // Don't block if already loading (for pagination)
    if (isLoading && !reset) return;

    try {
      // Full refresh only for pull-to-refresh
      if (reset && showFullRefresh) {
        setIsRefreshing(true);
      } else if (reset) {
        // Tab change: soft loading, keep existing data visible
        setIsLoading(true);
      } else {
        // Pagination: normal loading
        setIsLoading(true);
      }

      const qs = buildQuery(reset);
      const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox?${qs}`;
      const response = await fetchWithAuth(url, { method: 'GET' });
      const data = await response.json();
      console.log('data', data);

      if (response.ok && data?.success) {
        const conv = data?.data?.conversations || [];
        const pagination = data?.data?.pagination || {};
        const nextItems = mapConversations(conv);

        if (reset) {
          setMessages(nextItems);
          setPage(1);
        } else {
          setMessages(prev => [...prev, ...nextItems]);
        }
        setTotalPages(pagination?.totalPages || 1);

        // Update Redux store with unread count
        const unreadCount = nextItems.filter(m => m.isUnread).length;
        dispatch(updateInboxUnreadCount(unreadCount));
      } else {
        // non-ok handled by fetchWithAuth for auth errors; otherwise no-op
      }
    } catch (e) {
      // network or parse error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Load data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Fetch counts when screen comes into focus
      dispatch(fetchUnreadCounts());
      // Load inbox data
      loadInbox(true, false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])
  );

  useEffect(() => {
    // When tab or search changes, soft refresh (background loading, keep existing data visible)
    loadInbox(true, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchText]);

  const handleEndReached = () => {
    if (isLoading) return;
    if (page >= totalPages) return;
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      loadInbox(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ---- Animated right actions (Archive/Unarchive) ----
  const renderRightActions = (dragX, isArchivedTab) => {
    const scale = dragX.interpolate({
      inputRange: [-120, -60, 0],
      outputRange: [1, 0.92, 0.85],
      extrapolate: 'clamp',
    });
    const opacity = dragX.interpolate({
      inputRange: [-100, -30, 0],
      outputRange: [1, 0.7, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.archiveAction,
          {
            transform: [{ scale }],
            opacity,
            backgroundColor: isArchivedTab ? '#2dbf71' : lightPinkAccent, // green = unarchive, blue = archive
          },
        ]}
      >
        <Icon name="archive-outline" size={22} color={whiteColor} />
        <Text style={styles.archiveText}>
          {isArchivedTab ? 'Unarchive' : 'Archive'}
        </Text>
      </Animated.View>
    );
  };

  const renderMessageItem = ({ item }) => {
    const isArchivedTab = activeTab === 'Archived';

    // Disable swipe for archived tab
    if (isArchivedTab) {
      return (
        <TouchableOpacity
          style={styles.messageCard}
          activeOpacity={0.9}
        // onPress={() => {
        //   setTicket(item);
        //   setShowTicketModal(true);
        //   // Fetch ticket details when modal opens
        //   if (item.ticketId) {
        //     fetchTicketDetails(item.ticketId);
        //   }
        // }}
        >
          <View style={styles.messageContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.iconColor, borderRadius: 100 },
              ]}
            >
              <MaterialIcons name="message" size={20} color={whiteColor} />
            </View>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageTitle}>{item?.title}</Text>
              <Text style={styles.messageSender}>Expand Support Team({item?.categoryName})</Text>
              <Text style={styles.messagePreview} numberOfLines={2}>
                {item?.message}
              </Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              {/* {item.isUnread && <View style={styles.unreadDot} />} */}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Enable swipe only for non-archived tabs
    return (
      <Swipeable
        overshootRight={false}
        friction={1.15} // smoother/controlled
        rightThreshold={36} // quick trigger
        renderRightActions={(progress, dragX) =>
          renderRightActions(dragX, false)
        }
        onSwipeableOpen={direction => {
          if (direction === 'right') {
            handleArchive(item.ticketId || item.id);
          }
        }}
      >
        <TouchableOpacity
          style={styles.messageCard}
          activeOpacity={0.9}
          onPress={() => {
            setTicket(item);
            setShowTicketModal(true);
            // Mark as read when modal opens
            markAsRead(item);
            // Fetch ticket details when modal opens
            if (item.ticketId) {
              fetchTicketDetails(item.ticketId);
            }
          }}
        >
          <View style={styles.messageContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.iconColor, borderRadius: 100 },
              ]}
            >
              <MaterialIcons name="message" size={20} color={whiteColor} />
            </View>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageTitle}>{item.title}</Text>
              <Text style={styles.messageSender}>Expand Support Team({item?.categoryName})</Text>
              <Text style={styles.messagePreview} numberOfLines={2}>
                {item.message}
              </Text>
            </View>
            <View style={styles.messageMeta}>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              {item.isUnread && <View style={styles.unreadDot} />}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === item.id && styles.activeTab,
        alignJustifyCenter,
        flexDirectionRow,
      ]}
      onPress={() => {
        LayoutAnimation.configureNext(SmoothEase);
        setActiveTab(item.id);
      }}
    >
      <Text
        style={[styles.tabText, activeTab === item.id && styles.activeTabText]}
      >
        {item.label}
      </Text>
      {!!item.badge && (
        <View style={[styles.tabBadge, alignJustifyCenter]}>
          <Text style={styles.tabBadgeText}>{item.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    // Tip: App root ko GestureHandlerRootView se wrap karo (index/App me)
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, { padding: spacings.xLarge }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support Inbox</Text>
          <Text style={styles.headerSubtitle}>View and manage your support tickets</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={grayColor} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor={grayColor}
            value={searchText}
            onChangeText={t => {
              LayoutAnimation.configureNext(SmoothEase);
              setSearchText(t);
            }}
          />
        </View>

        {/* Filter Tabs */}
        <View style={[styles.tabsContainer]}>
          <FlatList
            data={tabs}
            renderItem={renderTab}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {activeTab === 'Archived'
              ? 'Swipe left to unarchive messages'
              : 'Swipe left to archive messages'}
          </Text>
        </View>

        {/* Initial Loading (first load) */}
        {isLoading && filteredMessages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={whiteColor} />
          </View>
        ) : filteredMessages.length > 0 ? (
          <FlatList
            data={filteredMessages}
            renderItem={renderMessageItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
            onEndReached={handleEndReached}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadInbox(true, true)}
                tintColor={whiteColor}
                colors={[whiteColor]}
                progressBackgroundColor={lightBlack}
              />
            }
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Icon
              name={emptyMessages[activeTab].icon}
              size={50}
              color={grayColor}
            />
            <Text
              style={{
                color: whiteColor,
                marginTop: 10,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {emptyMessages[activeTab].title}
            </Text>
            <Text style={{ color: grayColor, marginTop: 4, fontSize: 14 }}>
              {emptyMessages[activeTab].description}
            </Text>
          </View>
        )}
      </View>

      {/* Ticket Details Modal */}
      <Modal
        visible={showTicketModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTicketModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            paddingHorizontal: spacings.large,
          }}
        >
          <View style={[styles.detailsCard, styles.modalCardContainer]}>
            {/* Header with Close Button */}
            <View
              style={[
                flexDirectionRow,
                alignItemsCenter,
                justifyContentSpaceBetween,
                { marginBottom: spacings.xLarge },
              ]}
            >
              <Text style={styles.modalTitle}>Ticket Details</Text>
              <Pressable
                onPress={() => {
                  setShowTicketModal(false);
                  setTicketDetails(null);
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={whiteColor} />
              </Pressable>
            </View>

            {isLoadingDetails ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading ticket details...</Text>
              </View>
            ) : ticketDetails ? (
              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}
                nestedScrollEnabled={true}
              >
                {/* Status and Created Date Row */}
                <View
                  style={[
                    styles.statusRow,
                    flexDirectionRow,
                    alignItemsCenter,
                    justifyContentSpaceBetween,
                  ]}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(ticketDetails?.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {ticketDetails?.status === "in_progress" ? 'InProgress' : 'Pending'}
                    </Text>
                  </View>
                  <Text style={styles.updatedDate}>
                    Created {formatDate(ticketDetails?.createdAt)}
                  </Text>
                </View>

                {/* Ticket Number */}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Ticket Number</Text>
                  <Text style={styles.detailValue}>
                    {ticketDetails?.ticketNumber || 'N/A'}
                  </Text>
                </View>

                {/* Category */}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>
                    {ticketDetails?.categoryId?.name || 'N/A'}
                  </Text>
                </View>

                {/* Equipment details - only show if equipmentId exists */}
                {ticketDetails?.equipmentId && (
                  <>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Equipment Name</Text>
                      <Text style={styles.detailValue}>
                        {ticketDetails.equipmentId.name || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Serial Number</Text>
                      <Text style={styles.detailValue}>
                        {ticketDetails.equipmentId.serialNumber || 'N/A'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Model Number</Text>
                      <Text style={styles.detailValue}>
                        {ticketDetails.equipmentId.modelNumber || 'N/A'}
                      </Text>
                    </View>
                  </>
                )}

                {/* Created Date */}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Created Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(ticketDetails?.createdAt) || 'N/A'}
                  </Text>
                </View>

                {/* Description */}
                <View style={styles.descriptionSection}>
                  <Text style={styles.sectionLabel}>Description</Text>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>
                      {ticketDetails?.description || 'No description provided'}
                    </Text>
                  </View>
                </View>
                {/* Chat Button */}
                {/* <TouchableOpacity
                  style={[styles.chatButton, flexDirectionRow, alignItemsCenter, alignJustifyCenter]}
                  onPress={() => {
                    setShowTicketModal(false);
                    setTicketDetails(null);
                    navigation.navigate('ChatTab', {
                      screen: 'SupportChat',
                      params: {
                        ticketId: ticketDetails?._id,
                        ticketNumber: ticketDetails?.ticketNumber,
                        supportType: ticketDetails?.categoryId?.name || 'Support',
                        description: ticketDetails?.description,
                      },
                    });
                  }}
                >
                  <Icon name="chatbubbles-outline" size={20} color={whiteColor} />
                  <Text style={styles.chatButtonText}>Chat</Text>
                </TouchableOpacity> */}
              </ScrollView>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>No ticket details available</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: Platform.OS === 'ios' ? hp(88) : hp(90),
    backgroundColor: lightColor,
  },
  header: {
    paddingHorizontal: spacings.xxLarge,
    // paddingTop: spacings.large,
    paddingBottom: spacings.large,
    alignItems: 'center',
  },
  headerTitle: {
    ...style.fontSizeLargeX,
    ...style.fontWeightThin1x,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  headerSubtitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightBlack,
    borderRadius: 5,
    paddingHorizontal: spacings.large,
    paddingVertical: Platform.OS === 'ios' ? spacings.large : 0,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacings.medium,
    color: whiteColor,
    fontSize: style.fontSizeNormal.fontSize,
  },
  tabsContainer: {
    backgroundColor: lightBlack,
    borderRadius: 5,
    marginTop: spacings.xLarge,
    padding: spacings.small,
  },
  tab: {
    paddingVertical: spacings.medium,
    marginRight: spacings.medium,
    width: wp(29),
    height: hp(4.5),
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: lightPinkAccent,
  },
  tabText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  activeTabText: { color: whiteColor },
  tabBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: wp(5),
    height: wp(5),
    position: 'absolute',
    right: 1,
    top: 0,
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: whiteColor,
    fontSize: style.fontSizeSmall1x.fontSize,
    fontWeight: style.fontWeightBold.fontWeight,
  },
  instructionContainer: {
    paddingBottom: spacings.large,
    marginTop: spacings.xxxxLarge,
  },
  instructionText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  messagesList: { paddingBottom: spacings.xxLarge },
  messageCard: {
    backgroundColor: lightBlack,
    borderRadius: 12,
    marginBottom: spacings.medium,
    padding: spacings.xLarge,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageContent: { flexDirection: 'row', alignItems: 'flex-start' },
  iconContainer: {
    width: wp(12),
    height: Platform.OS === 'ios' ? hp(5.5) : hp(6),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.large,
  },
  messageTextContainer: { flex: 1 },
  messageTitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  messageSender: {
    ...style.fontSizeSmall,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.7,
  },
  messagePreview: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.9,
    lineHeight: 20,
    // marginTop: spacings.xsmall,
  },
  messageMeta: { alignItems: 'flex-end', marginLeft: spacings.small },
  timestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.xsmall,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: lightPinkAccent,
  },
  detailsCard: {
    backgroundColor: lightBlack,
    margin: spacings.large,
    borderRadius: 12,
    padding: spacings.xxLarge,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalCardContainer: {
    margin: 0,
    maxHeight: hp(85),
    width: '100%',
  },
  modalTitle: {
    ...style.fontSizeLargeX,
    ...style.fontWeightBold,
    color: whiteColor,
  },
  closeButton: {
    padding: spacings.small,
    borderRadius: 20,
    backgroundColor: lightColor,
  },
  statusRow: {
    marginBottom: spacings.xLarge,
    paddingBottom: spacings.large,
    borderBottomWidth: 1,
    borderBottomColor: lightColor,
  },
  statusBadge: {
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.normal,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    textTransform: 'capitalize',
  },
  updatedDate: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },
  detailsGrid: { marginBottom: spacings.large },
  detailItem: {
    marginBottom: spacings.large,
    paddingBottom: spacings.medium,
    borderBottomWidth: 1,
    borderBottomColor: lightColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginBottom: spacings.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  descriptionSection: {
    marginTop: spacings.small,
  },
  sectionLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descriptionBox: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.large,
  },
  descriptionText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 22,
  },

  // Swipe right-actions (visible when swiping left)
  archiveAction: {
    width: 104,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.medium,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  archiveText: { color: whiteColor, marginTop: 6, fontWeight: '600' },
  loadingContainer: {
    padding: spacings.xxLarge,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(30),
  },
  loadingText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  modalScrollView: {
    maxHeight: hp(65),
  },
  modalScrollContent: {
    paddingBottom: spacings.xxLarge,
    flexGrow: 1,
  },
  attachmentsSection: {
    marginTop: spacings.small,
    marginBottom: spacings.medium,
  },
  attachmentText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: spacings.small,
    opacity: 0.8,
  },
  chatButton: {
    backgroundColor: lightPinkAccent,
    borderRadius: 8,
    padding: spacings.large,
    marginTop: spacings.xLarge,
    gap: spacings.small,
  },
  chatButtonText: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginLeft: spacings.small,
  },
});