import React, { useMemo, useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

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
} from '../utils';
import { BaseStyle } from '../constans/Style';

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

const InboxAgent = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticket, setTicket] = useState(null);

  // ---- DATA IN STATE (archiving needs state) ----
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: 'CNC calibration issue',
      sender: 'Support Team',
      message:
        'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
      timestamp: '2 hours ago',
      isUnread: false,
      iconColor: 'transparent',
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      status: 'Resolved',
      isArchived: false,
    },
    {
      id: 2,
      title: 'Software license activation',
      sender: 'Support Team',
      message:
        "Let me check the license key in our system. I'll get back to you within 24...",
      timestamp: '1 day ago',
      isUnread: true,
      status: 'In Progress',
      iconColor: lightPinkAccent,
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      isArchived: false,
    },
    {
      id: 3,
      title: 'Replacement spindle bearing',
      sender: 'Support Team',
      message:
        "We've received your parts request and are preparing a quote. You should receive it by...",
      timestamp: '3 days ago',
      isUnread: false,
      status: 'Resolved',
      iconColor: 'transparent',
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      isArchived: false,
    },
    {
      id: 4,
      title: 'Maintenance schedule query',
      sender: 'Support Team',
      message:
        'Thank you for the detailed maintenance schedule. This will help us plan our...',
      timestamp: '1 week ago',
      isUnread: false,
      status: 'Resolved',
      iconColor: 'transparent',
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      isArchived: false,
    },
    {
      id: 5,
      title: 'CNC calibration issue',
      sender: 'Support Team',
      message:
        'Our technician visited and replaced the linear encoders. The system has been recalibrate...',
      timestamp: '2 hours ago',
      isUnread: false,
      status: 'Resolved',
      iconColor: 'transparent',
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      isArchived: false,
    },
    {
      id: 6,
      title: 'Software license activation',
      sender: 'Support Team',
      message:
        "Let me check the license key in our system. I'll get back to you within 24...",
      timestamp: '1 day ago',
      isUnread: true,
      status: 'In Progress',
      iconColor: lightPinkAccent,
      machine: 'Genturn 2540',
      serial: 'GT2540-2023-015',
      category: 'Applications Support',
      createdDate: '18/01/2024',
      description: 'Unable to activate new CAM software license',
      isArchived: false,
    },
  ]);

  // ---- BADGE COUNTS DYNAMIC ----
  const tabs = useMemo(
    () => [
      { id: 'All', label: 'All' },
      {
        id: 'Unread',
        label: 'Unread',
        badge: messages.filter(m => m.isUnread && !m.isArchived).length,
      },
      { id: 'Archived', label: 'Archived' },
    ],
    [messages],
  );

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
    switch (status) {
      case 'Resolved':
        return greenColor;
      case 'In Progress':
        return '#FFA500';
      case 'Open':
        return lightPinkAccent;
      default:
        return grayColor;
    }
  };

  // ---- ARCHIVE / UNARCHIVE with smooth layout ----
  const handleArchive = id => {
    LayoutAnimation.configureNext(SmoothEase);
    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, isArchived: true, isUnread: false } : m,
      ),
    );
  };

  const handleUnarchive = id => {
    LayoutAnimation.configureNext(SmoothEase);
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, isArchived: false } : m)),
    );
  };

  // ---- FILTERS ----
  const filteredMessages = useMemo(() => {
    return messages
      .filter(msg => {
        if (activeTab === 'Unread') return msg.isUnread && !msg.isArchived;
        if (activeTab === 'Archived') return msg.isArchived;
        return !msg.isArchived; // All: archived hidden
      })
      .filter(
        msg =>
          msg.title.toLowerCase().includes(searchText.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchText.toLowerCase()),
      );
  }, [messages, activeTab, searchText]);

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
    return (
      <Swipeable
        overshootRight={false}
        friction={1.15} // smoother/controlled
        rightThreshold={36} // quick trigger
        renderRightActions={(progress, dragX) =>
          renderRightActions(dragX, isArchivedTab)
        }
        onSwipeableOpen={direction => {
          if (direction === 'right') {
            if (isArchivedTab) handleUnarchive(item.id);
            else handleArchive(item.id);
          }
        }}
      >
        <TouchableOpacity
          style={styles.messageCard}
          activeOpacity={0.9}
          onPress={() => {
            setShowTicketModal(true);
            setTicket(item);
          }}
        >
          <View style={styles.messageContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.iconColor },
              ]}
            >
              <Icon name="settings-outline" size={20} color={whiteColor} />
            </View>
            <View style={styles.messageTextContainer}>
              <Text style={styles.messageTitle}>{item.title}</Text>
              <Text style={styles.messageSender}>{item.sender}</Text>
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

        {/* Messages List */}
        {filteredMessages.length > 0 ? (
          <FlatList
            data={filteredMessages}
            renderItem={renderMessageItem}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: spacings.large,
          }}
        >
          <View style={[styles.detailsCard, { margin: 0 }]}>
            <Pressable
              style={{ alignSelf: 'flex-end', marginBottom: spacings.medium }}
              onPress={() => setShowTicketModal(false)}
            >
              <Icon name="close" size={24} color={whiteColor} />
            </Pressable>

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
                  { backgroundColor: getStatusColor(ticket?.status) },
                ]}
              >
                <Text style={styles.statusText}>{ticket?.status}</Text>
              </View>
              <Text style={styles.updatedDate}>
                Updated {ticket?.updatedDate}
              </Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Machine:</Text>
                <Text style={styles.detailValue}>{ticket?.machine}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Serial:</Text>
                <Text style={styles.detailValue}>{ticket?.serial}</Text>
              </View>
              <View className="detailItem">
                <Text style={styles.detailLabel}>Category:</Text>
                <Text style={styles.detailValue}>{ticket?.category}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Created:</Text>
                <Text style={styles.detailValue}>{ticket?.createdDate}</Text>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>
                  {ticket?.description}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default InboxAgent;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: Platform.OS === 'ios' ? hp(88) : hp(90),
    backgroundColor: lightColor,
  },
  header: {
    paddingHorizontal: spacings.xxLarge,
    paddingTop: spacings.xxLarge,
    paddingBottom: spacings.large,
    alignItems: 'center',
  },
  headerTitle: {
    ...style.fontSizeLargeX,
    ...style.fontWeightThin1x,
    color: whiteColor,
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
    height: hp(5.5),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacings.large,
  },
  messageTextContainer: { flex: 1 },
  messageTitle: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  messageSender: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  messagePreview: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    opacity: 0.8,
    lineHeight: 20,
  },
  messageMeta: { alignItems: 'flex-end', marginLeft: spacings.medium },
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: { marginBottom: spacings.large },
  statusBadge: {
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small,
    borderRadius: 20,
  },
  statusText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightBold,
    color: whiteColor,
  },
  updatedDate: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },
  detailsGrid: { marginBottom: spacings.large },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacings.small,
  },
  detailLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
  detailValue: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  descriptionSection: { marginBottom: spacings.large },
  sectionLabel: {
    ...style.fontSizeNormal,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.small,
  },
  descriptionBox: {
    backgroundColor: lightColor,
    borderRadius: 8,
    padding: spacings.medium,
  },
  descriptionText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
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
});