import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import {
  darkgrayColor,
  whiteColor,
  lightGrayColor,
  grayColor,
  lightBlack,
  lightColor,
  lightPinkAccent,
  supportGreen,
} from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  fetchWithAuth,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ENDPOINTS } from '../constans/Constants';

const {
  flex,
  alignJustifyCenter,
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
} = BaseStyle;

const SupportChatScreen = ({ navigation, route }) => {
  const {
    ticketId,
    ticketNumber,
    supportType,
    equipmentData,
    description,
    attachedImages,
  } = route.params || {};

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Welcome! I see you've submitted ticket ${ticketNumber || 'N/A'}. How can I help you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const flatListRef = useRef(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch ticket details on mount
  useEffect(() => {
    if (ticketId) {
      console.log('Fetching details for ticket ID:', ticketId);
      
      fetchTicketDetails();
    }
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    if (!ticketId || isLoadingDetails) return;

    try {
      setIsLoadingDetails(true);
      const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${ticketId}/details?page=1&limit=20`;
      const response = await fetchWithAuth(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data?.success && data?.data?.ticket) {
        setTicketDetails(data.data.ticket);
      }
    } catch (error) {
      console.log('Ticket details fetch error:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate support response after 2 seconds
      setTimeout(() => {
        const supportResponse = {
          id: Date.now() + 1,
          text: 'Your ticket is under review. Please wait while our team connects with you.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages(prev => [...prev, supportResponse]);
      }, 2000);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser
          ? styles.userMessageContainer
          : styles.supportMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.supportMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.supportMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          flexDirectionRow,
          alignItemsCenter,
          justifyContentSpaceBetween,
        ]}
      >
        <View style={[flexDirectionRow, alignItemsCenter]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={whiteColor} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {ticketDetails?.categoryId?.name || supportType || 'Support Chat'}
            </Text>
            <Text style={styles.ticketNumber}>
              Ticket #{ticketDetails?.ticketNumber || ticketNumber || 'N/A'}
            </Text>
          </View>
          {/* <View
            style={[styles.onlineStatus, flexDirectionRow, alignItemsCenter]}
          >
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: isOnline ? supportGreen : grayColor },
              ]}
            />
            <Text style={styles.onlineText}>Online</Text>
          </View> */}
        </View>
      </View>
      {isLoadingDetails ? (
        <View style={[styles.detailsCard, alignJustifyCenter]}>
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      ) : ticketDetails ? (
        <View style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
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
          </View>
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {ticketDetails?.description || description || 'No description provided'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
            {supportType && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Support Type</Text>
                <Text style={styles.detailValue}>{supportType}</Text>
              </View>
            )}
            {equipmentData?.model && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Model</Text>
                <Text style={styles.detailValue}>{equipmentData.model}</Text>
              </View>
            )}
            {equipmentData?.serial && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Serial</Text>
                <Text style={styles.detailValue}>{equipmentData.serial}</Text>
              </View>
            )}
          </View>
          {description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{description}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Text style={styles.conversationTitle}>Conversation</Text>
      <View style={{ borderTopWidth: 1, borderTopColor: grayColor }}></View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // header height adjust kare
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputArea, flexDirectionRow, alignItemsCenter]}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={lightGrayColor}
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                alignJustifyCenter,
                !inputText.trim() && styles.disabledSendButton,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Feather
                name="send"
                size={20}
                color={inputText.trim() ? whiteColor : lightGrayColor}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.responseTime}>
            Our support team typically responds within minutes
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColor,
  },
  header: {
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
    borderBottomWidth: 1,
    borderBottomColor: grayColor,
  },
  backButton: {
    padding: spacings.small,
    marginRight: spacings.medium,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: whiteColor,
  },
  ticketNumber: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: 2,
  },
  onlineStatus: {
    paddingHorizontal: spacings.small,
    paddingVertical: spacings.xsmall,
    backgroundColor: lightBlack,
    borderRadius: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacings.xsmall,
  },
  onlineText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacings.large,
    paddingBottom: spacings.medium,
  },
  messageContainer: {
    marginBottom: spacings.medium,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  supportMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: wp(75),
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small,
    borderRadius: 12,
  },
  userMessageBubble: {
    backgroundColor: '#490517',
    borderBottomRightRadius: 4,
  },
  supportMessageBubble: {
    backgroundColor: lightBlack,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    lineHeight: 20,
  },
  userMessageText: {
    color: whiteColor,
  },
  supportMessageText: {
    color: whiteColor,
  },
  timestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginTop: spacings.xsmall,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
    borderTopWidth: 1,
    borderTopColor: grayColor,
  },
  inputArea: {
    // backgroundColor: lightBlack,
    borderRadius: 20,
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small,
    marginBottom: spacings.small,
  },
  textInput: {
    flex: 1,
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    maxHeight: hp(10),
    paddingVertical: spacings.small,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: lightPinkAccent,
    marginLeft: spacings.small,
  },
  disabledSendButton: {
    backgroundColor: lightBlack,
  },
  responseTime: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    textAlign: 'center',
  },
  statusRow: {
    marginBottom: spacings.large,
  },
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
  detailsCard: {
    backgroundColor: lightBlack,
    margin: spacings.large,
    borderRadius: 12,
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
  detailsGrid: {
    marginBottom: spacings.large,
  },
  detailItem: {
    width: widthPercentageToDP(85),
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
  descriptionSection: {
    marginBottom: spacings.large,
  },
  resolutionSection: {
    marginBottom: spacings.small,
  },
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
    maxHeight: hp(15),
  },
  descriptionText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
  },
  conversationTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightBold,
    color: whiteColor,
    marginLeft: spacings.medium,
    marginBottom: spacings.medium,
  },
  loadingText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
  },
});

export default SupportChatScreen;
