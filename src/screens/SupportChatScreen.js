import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  whiteColor,
  lightGrayColor,
  grayColor,
  lightBlack,
  lightColor,
  lightPinkAccent,
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
import { connectSocket, getSocket } from '../socket/socket';
import { fetchUnreadCounts } from '../store/slices/unreadCountSlice';

const {
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
    chatId,
  } = route.params || {};

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const socketRef = useRef(null);
  const lastReadMessageIdRef = useRef(null);
  const socketMessageHandlerRef = useRef(null);
  const attachedSocketRef = useRef(null);
  const socketConnectHandlerRef = useRef(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          setUserDetails(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const currentUserId = userDetails?.id || userDetails?._id;
  const normalizeId = useCallback((value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value._id || value.id || null;
    }
    return null;
  }, []);

  useEffect(() => {
    if (ticketId) {
      console.log("caht", chatId);

      fetchTicketDetails();
    }
  }, [ticketId, chatId]);

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

  const formatTimestamp = useCallback((dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return '';
    }
  }, []);

  const mapMessage = useCallback(
    (message) => {
      if (!message) return null;

      const payload = message?.data || message?.message || message?.payload || message;
      const normalizedChatId = normalizeId(payload.chatId || payload.chat) || chatId;
      const normalizedTicketId = normalizeId(payload.ticketId || payload.ticket) || ticketId;
      const senderInfo = payload.sender || {};

      const id =
        payload._id ||
        payload.id ||
        `${normalizedChatId}-${payload.createdAt || Date.now()}`;

      const createdAt = payload.createdAt || payload.updatedAt || new Date().toISOString();

      return {
        id,
        chatId: normalizedChatId,
        ticketId: normalizedTicketId,
        text: payload.content || '',
        messageType: payload.messageType || 'text',
        senderId: senderInfo.userId || payload.senderId,
        senderName: senderInfo.userName || payload.senderName || 'Support',
        senderType: senderInfo.userType || payload.senderType,
        createdAt,
        timestamp: formatTimestamp(createdAt),
        isUser: currentUserId
          ? (senderInfo.userId || payload.senderId) === currentUserId
          : (senderInfo.userType || payload.senderType) === 'customer',
        status: payload.status || 'sent',
        attachments: payload.attachments || [],
        raw: payload,
      };
    },
    [chatId, currentUserId, formatTimestamp, normalizeId, ticketId],
  );

  const mergeIncomingMessage = useCallback(
    (incomingMessage) => {
      if (!incomingMessage) return;
      const payload = incomingMessage?.data || incomingMessage?.message || incomingMessage?.payload || incomingMessage;
      const payloadChatId = normalizeId(payload.chatId || payload.chat);
      const payloadTicketId = normalizeId(payload.ticketId || payload.ticket);

      if (chatId && payloadChatId && payloadChatId !== chatId) {
        return;
      }
      if (ticketId && payloadTicketId && payloadTicketId !== ticketId) {
        return;
      }
      const mapped = mapMessage(payload);
      if (!mapped) return;

      setMessages((prevMessages) => {
        const existingIndex = prevMessages.findIndex((msg) => msg.id === mapped.id);
        if (existingIndex !== -1) {
          const next = [...prevMessages];
          next[existingIndex] = mapped;
          return next;
        }

        if (mapped.isUser) {
          for (let i = prevMessages.length - 1; i >= 0; i -= 1) {
            const candidate = prevMessages[i];
            if (candidate.isUser && candidate.status === 'pending') {
              const next = [...prevMessages];
              next[i] = mapped;
              return next;
            }
          }
        }

        return [...prevMessages, mapped].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    },
    [mapMessage, chatId, ticketId, normalizeId],
  );

  const fetchChatMessages = useCallback(async () => {
    if (!chatId) return;

    try {
      setIsLoadingMessages(true);
      const url = `${API_ENDPOINTS.BASE_URL}/api/app/chat/${chatId}/messages`;
      const response = await fetchWithAuth(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data?.success && Array.isArray(data?.data)) {
        const formatted = data.data
          .map(mapMessage)
          .filter(Boolean)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMessages(formatted);
      } else {
        console.log('Failed to load chat messages', data);
      }
    } catch (error) {
      console.log('Chat messages fetch error:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [chatId, mapMessage]);

  const ensureSocketConnection = useCallback(async () => {
    try {
      let socketInstance = getSocket();
      if (!socketInstance || !socketInstance.connected) {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return null;
        socketInstance = connectSocket(token);
      }
      return socketInstance;
    } catch (error) {
      console.log('Failed to ensure socket connection:', error);
      return null;
    }
  }, []);

  const detachSocketListeners = useCallback(
    (socketInstance) => {
      if (!socketInstance) return;

      if (socketMessageHandlerRef.current) {
        socketInstance.off('new_message', socketMessageHandlerRef.current);
        socketInstance.off('message_broadcast', socketMessageHandlerRef.current);
      }

      if (socketConnectHandlerRef.current) {
        socketInstance.off('connect', socketConnectHandlerRef.current);
      }

      socketMessageHandlerRef.current = null;
      socketConnectHandlerRef.current = null;
      if (attachedSocketRef.current === socketInstance) {
        attachedSocketRef.current = null;
      }
    },
    [],
  );

  const attachSocketListeners = useCallback(
    (socketInstance) => {
      if (!socketInstance) return;

      if (attachedSocketRef.current === socketInstance && socketMessageHandlerRef.current) {
        return;
      }

      if (attachedSocketRef.current && attachedSocketRef.current !== socketInstance) {
        detachSocketListeners(attachedSocketRef.current);
      }

      const handler = (eventPayload) => {
        const payloads = Array.isArray(eventPayload) ? eventPayload : [eventPayload];
        payloads.forEach((payload) => {
          if (!payload) return;
          console.log('📨 socket payload received:', payload);
          mergeIncomingMessage(payload?.data || payload);
          markAsRead(payload);
          dispatch(fetchUnreadCounts());
        });
      };

      console.log('🔗 attaching socket listeners');
      socketInstance.on('new_message', handler);
      socketInstance.on('message_broadcast', handler);

      if (socketConnectHandlerRef.current) {
        socketInstance.off('connect', socketConnectHandlerRef.current);
      }

      const handleConnect = () => {
        console.log('🔄 socket connect event');
        if (ticketId) {
          socketInstance.emit('join_ticket', ticketId);
          console.log('🚪 emitted join_ticket from connect handler', ticketId);
        }
      };

      socketInstance.on('connect', handleConnect);

      socketMessageHandlerRef.current = handler;
      socketConnectHandlerRef.current = handleConnect;
      attachedSocketRef.current = socketInstance;
      console.log('✅ socket listeners attached');
    },
    [detachSocketListeners, mergeIncomingMessage, ticketId],
  );

  useEffect(() => {
    let isMounted = true;
    let socketInstance;

    const registerSocketEvents = async () => {
      socketInstance = await ensureSocketConnection();
      if (!socketInstance || !isMounted) return;

      socketRef.current = socketInstance;

      attachSocketListeners(socketInstance);

      if (ticketId) {
        socketInstance.emit('join_ticket', ticketId);
        console.log('🚪 Emitted join_ticket', ticketId);
      }
    };

    registerSocketEvents();

    return () => {
      isMounted = false;
      if (socketInstance) {
        if (ticketId) {
          socketInstance.emit('leave_ticket', ticketId);
        }
        detachSocketListeners(socketInstance);
      }
    };
  }, [attachSocketListeners, detachSocketListeners, ensureSocketConnection, ticketId, chatId]);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  useEffect(() => {
    if (!userDetails) return;

    setMessages((prev) =>
      prev
        .map((message) => {
          const remapped = mapMessage(message.raw || message);
          return remapped || message;
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
  }, [userDetails, mapMessage]);


  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);


  const handleChangeText = useCallback(
    (text) => {
      setInputText(text);
    },
    [],
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !chatId || !ticketId) return;

    const now = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      text: trimmed,
      messageType: 'text',
      senderId: currentUserId,
      senderName: userDetails?.name,
      senderType: 'customer',
      createdAt: now,
      timestamp: formatTimestamp(now),
      isUser: true,
      status: 'pending',
      attachments: [],
    };

    // show temp
    setMessages((prev) => [...prev, tempMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    setInputText('');

    try {
      let socket = socketRef.current;
      if (!socket || !socket.connected) {
        socket = await ensureSocketConnection();
        if (socket) {
          socketRef.current = socket;
          if (ticketId) {
            socket.emit('join_ticket', ticketId);
          }
        }
      }

      if (!socket || !socket.connected) {
        throw new Error('Unable to connect to chat server. Please try again.');
      }

      if (attachedSocketRef.current !== socket || !socketMessageHandlerRef.current) {
        attachSocketListeners(socket);
      }

      socket.emit('send_message', {
        chatId,
        ticketId,
        content: trimmed,
        messageType: 'text',
      });

      try {
        const url = `${API_ENDPOINTS.BASE_URL}/api/app/chat/send`;
        await fetchWithAuth(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId,
            content: trimmed,
            messageType: 'text',
          }),
        });
      } catch (apiError) {
        console.log('Send message API error:', apiError);
      }
    } catch (error) {
      console.log('Send message error:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    }
  }, [
    chatId,
    ticketId,
    inputText,
    currentUserId,
    userDetails?.name,
    formatTimestamp,
    ensureSocketConnection,
    attachSocketListeners,
  ]);


  const renderMessage = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessageContainer : styles.supportMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            item.isUser ? styles.userMessageBubble : styles.supportMessageBubble,
          ]}
        >
          <Text style={styles.senderName}>
            {item.isUser ? 'You' : item.senderName || 'Support'}
          </Text>
          <Text
            style={[
              styles.messageText,
              item.isUser ? styles.userMessageText : styles.supportMessageText,
            ]}
          >
            {item.text || 'Unsupported message type'}
          </Text>
          <Text style={styles.timestamp}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };


  const markAsRead = async (chat) => {
    if (!chat) return;
    const chatIdToMark = chat?.chatId || chatId;
    console.log("chat?.ticketId ::", chatIdToMark);

    try {
      const url = `${API_ENDPOINTS.BASE_URL}/api/app/chat/${chatIdToMark}/readAllMessages`;
      console.log('url (ticket):::::::', url);

      const response = await fetchWithAuth(url, { method: 'PUT' });
      const data = await response.json();
      if (response.ok && data?.success) {
        // Refresh data to get updated read status from API
        console.log(data?.message);
        fetchUnreadCounts();
      } else {
        console.log('Failed to mark as read:', data?.message || 'Unknown error');
      }

    } catch (error) {
      console.log('Mark as read error:', error);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => { navigation.goBack(); markAsRead(chatId); }}
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
        </View>
      </View>
      {isLoadingDetails ? (
        <View style={[styles.detailsCard, alignJustifyCenter]}>
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      ) : ticketDetails ? (
        <View style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>
                {ticketDetails?.categoryId?.name || 'N/A'}
              </Text>
            </View>

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
                {ticketDetails?.description ||
                  description ||
                  'No description provided'}
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
      <View style={{ borderTopWidth: 1, borderTopColor: grayColor }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0 ? styles.messagesEmptyContent : null,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isLoadingMessages ? (
              <ActivityIndicator size="small" color={whiteColor} />
            ) : (
              <Text style={styles.emptyStateText}>
                No messages yet. Start the conversation!
              </Text>
            )
          }
        />

        <View style={styles.inputContainer}>
          <View style={[styles.inputArea, flexDirectionRow, alignItemsCenter]}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              placeholderTextColor={lightGrayColor}
              value={inputText}
              onChangeText={handleChangeText}
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
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacings.large,
    paddingBottom: spacings.medium,
  },
  messagesEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  senderName: {
    ...style.fontSizeSmall,
    // ...style.fontWeightMedium,
    color: lightGrayColor,
    marginBottom: spacings.xsmall,
  },
  inputContainer: {
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
    borderTopWidth: 1,
    borderTopColor: grayColor,
  },
  inputArea: {
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
  emptyStateText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },
});

export default SupportChatScreen;

