import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import colors, {
  grayColor,
  lightBlack,
  lightGrayColor,
  lightPinkAccent,
  lightColor,
  whiteColor,
} from '../constans/Color';
import { spacings, style } from '../constans/Fonts';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../utils';
import { API_ENDPOINTS } from '../constans/Constants';
import { BaseStyle } from '../constans/Style';
import { connectSocket, getSocket } from '../socket/socket';
import { fetchUnreadCounts } from '../store/slices/unreadCountSlice';

const {
  flexDirectionRow,
  alignItemsCenter,
  justifyContentSpaceBetween,
  alignJustifyCenter,
} = BaseStyle;

const AgentChatScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { customer } = route.params || {};
  const initialTicketId =
    customer?.id ||
    customer?._id ||
    customer?.ticketId ||
    customer?.ticket ||
    customer?.__raw?._id ||
    customer?.__raw?.ticketId ||
    null;

  const [ticketId, setTicketId] = useState(initialTicketId);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(
    customer?.__raw || customer || null,
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const socketMessageHandlerRef = useRef(null);
  const socketConnectHandlerRef = useRef(null);
  const attachedSocketRef = useRef(null);
  const lastReadMessageIdRef = useRef(null);
  const chatIdRef = useRef(chatId);
  const ticketIdRef = useRef(ticketId);
  const [authToken, setAuthToken] = useState(null);
  const [tokenReady, setTokenReady] = useState(false);
  const isFetchingThreadRef = useRef(false);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    ticketIdRef.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUserDetails(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Failed to load user data:', error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.log('Failed to load auth token:', error);
      } finally {
        setTokenReady(true);
      }
    };

    loadToken();
  }, []);

  const currentUserId = useMemo(
    () => userDetails?.id || userDetails?._id || null,
    [userDetails],
  );
  const isAgentUser = useMemo(() => {
    const role = userDetails?.role || userDetails?.userRole;
    const type = userDetails?.userType;
    return role === 'agent' || type === 'agent';
  }, [userDetails]);

  const authorizedFetch = useCallback(
    async (url, options = {}) => {
      const token = authToken || (await AsyncStorage.getItem('userToken'));
      if (!token) {
        throw new Error('No authentication token');
      }

      const mergedHeaders = {
        Accept: 'application/json',
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      };

      return fetch(url, {
        ...options,
        headers: mergedHeaders,
      });
    },
    [authToken],
  );

  const normalizeId = useCallback((value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      return value._id || value.id || value.ticketId || null;
    }
    return null;
  }, []);

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

      const payload =
        message?.data || message?.message || message?.payload || message;
      const normalizedChatId =
        normalizeId(payload.chatId || payload.chat || payload.chatInfo) ||
        chatIdRef.current;
      const normalizedTicketId =
        normalizeId(payload.ticketId || payload.ticket) || ticketIdRef.current;
      const senderInfo = payload.sender || {};
      const messageType = payload.messageType || payload.type || 'text';
      const isSystemMessage =
        messageType === 'system' ||
        messageType === 'infoSystem' ||
        payload.isSystem;

      const clientMessageId =
        payload.clientMessageId ||
        payload.localMessageId ||
        payload.tempId ||
        payload.clientId ||
        payload.clientMessageID ||
        null;

      const serverId =
        payload._id || payload.id || payload.messageId || null;

      const id =
        payload._id ||
        payload.id ||
        payload.messageId ||
        clientMessageId ||
        `${normalizedChatId || 'chat'}-${payload.createdAt || Date.now()}`;

      const createdAt =
        payload.createdAt || payload.updatedAt || new Date().toISOString();

      const senderId = senderInfo.userId || payload.senderId || null;
      const senderType = senderInfo.userType || payload.senderType || null;
      const senderName =
        senderInfo.userName ||
        payload.senderName ||
        (isSystemMessage ? 'System Message' : 'Support');

      return {
        id,
        chatId: normalizedChatId,
        ticketId: normalizedTicketId,
        text: payload.content || payload.text || '',
        messageType,
        senderId,
        senderName,
        senderType,
        createdAt,
        timestamp: formatTimestamp(createdAt),
        isUser: isSystemMessage
          ? false
          : currentUserId
            ? senderId === currentUserId
            : senderType === 'agent',
        isSystem: Boolean(isSystemMessage),
        status: payload.status || 'sent',
        attachments: payload.attachments || [],
        clientMessageId: clientMessageId || null,
        serverId,
        raw: payload,
      };
    },
    [currentUserId, formatTimestamp, normalizeId],
  );

  const mergeIncomingMessage = useCallback(
    (incomingMessage) => {
      if (!incomingMessage) return;

      const payload =
        incomingMessage?.data ||
        incomingMessage?.message ||
        incomingMessage?.payload ||
        incomingMessage;
      const payloadChatId = normalizeId(payload.chatId || payload.chat);
      const payloadTicketId = normalizeId(payload.ticketId || payload.ticket);

      if (
        chatIdRef.current &&
        payloadChatId &&
        payloadChatId !== chatIdRef.current
      ) {
        return;
      }

      if (
        ticketIdRef.current &&
        payloadTicketId &&
        payloadTicketId !== ticketIdRef.current
      ) {
        return;
      }

      const mapped = mapMessage(payload);
      if (!mapped) return;

      setMessages((prevMessages) => {
        const matchesMessage = (msg) => {
          if (!msg) return false;

          const msgClientMessageId =
            msg.clientMessageId ||
            msg.raw?.clientMessageId ||
            msg.raw?.localMessageId ||
            msg.raw?.tempId ||
            null;
          const mappedClientMessageId =
            mapped.clientMessageId ||
            mapped.raw?.clientMessageId ||
            mapped.raw?.localMessageId ||
            mapped.raw?.tempId ||
            null;
          const msgServerId = msg.raw?._id || msg.raw?.id || msg.raw?.messageId;
          const mappedServerId =
            mapped.raw?._id || mapped.raw?.id || mapped.raw?.messageId;

          if (msg.id === mapped.id) {
            return true;
          }
          if (
            mappedClientMessageId &&
            (msg.id === mappedClientMessageId ||
              msgClientMessageId === mappedClientMessageId)
          ) {
            return true;
          }
          if (mappedServerId && msgServerId && msgServerId === mappedServerId) {
            return true;
          }
          if (
            !mappedServerId &&
            !msgServerId &&
            mapped.isUser === msg.isUser &&
            mapped.text === msg.text
          ) {
            const mappedCreated = mapped.createdAt
              ? new Date(mapped.createdAt).getTime()
              : 0;
            const msgCreated = msg.createdAt
              ? new Date(msg.createdAt).getTime()
              : 0;
            if (mappedCreated && msgCreated) {
              const delta = Math.abs(mappedCreated - msgCreated);
              if (delta <= 2000) {
                return true;
              }
            }
          }
          return false;
        };

        const existingIndex = prevMessages.findIndex(matchesMessage);

        if (existingIndex !== -1) {
          const next = [...prevMessages];
          const previous = prevMessages[existingIndex];
          const mergedMessage = {
            ...mapped,
            id: previous.id,
            clientMessageId:
              previous.clientMessageId ||
              mapped.clientMessageId ||
              previous.id ||
              mapped.id,
            serverId:
              mapped.serverId ||
              previous.serverId ||
              mapped.raw?._id ||
              mapped.raw?.id ||
              mapped.id,
            status: mapped.status || previous.status || 'sent',
            raw: {
              ...(previous.raw || {}),
              ...(mapped.raw || {}),
              clientMessageId:
                previous.clientMessageId ||
                mapped.clientMessageId ||
                mapped.raw?.clientMessageId ||
                previous.raw?.clientMessageId ||
                previous.id,
            },
          };
          next[existingIndex] = mergedMessage;
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

        return [...prevMessages, mapped].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      });
    },
    [mapMessage, normalizeId],
  );

  const fetchChatThread = useCallback(async () => {
    if (!ticketIdRef.current) return;
    if (!tokenReady) return;
    if (!authToken) {
      console.log('Agent chat fetch skipped: missing auth token');
      return;
    }
    if (isFetchingThreadRef.current) return;

    try {
      isFetchingThreadRef.current = true;
      setIsLoadingMessages(true);

      const url = `${API_ENDPOINTS.BASE_URL}/api/app/agent/chat/ticket/${ticketIdRef.current}`;
      const response = await authorizedFetch(url, { method: 'GET' });
      const data = await response.json();

      if (response.ok && data?.success) {
        const incomingChat = data?.data?.chat || null;
        const incomingTicket = data?.data?.ticket || null;
        const incomingMessages = Array.isArray(data?.data?.messages)
          ? data.data.messages
          : [];

        if (incomingTicket) {
          setTicketDetails(incomingTicket);
          const normalizedTicketId =
            incomingTicket?._id || incomingTicket?.ticketId || null;
          if (normalizedTicketId) {
            setTicketId(normalizedTicketId);
          }
        }

        if (incomingChat) {
          setChatInfo(incomingChat);
          const normalizedChatId = incomingChat?._id || incomingChat?.id || null;
          if (normalizedChatId) {
            setChatId(normalizedChatId);
          }
        }

        const formattedMessages = incomingMessages
          .map(mapMessage)
          .filter(Boolean)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setMessages(formattedMessages);
        if (formattedMessages.length > 0) {
          lastReadMessageIdRef.current =
            formattedMessages[formattedMessages.length - 1].id;
        }
      } else {
        console.log('Failed to load agent chat thread', data);
      }
    } catch (error) {
      console.log('Agent chat fetch error:', error);
    } finally {
      isFetchingThreadRef.current = false;
      setIsLoadingMessages(false);
    }
  }, [authToken, authorizedFetch, mapMessage, tokenReady]);

  useEffect(() => {
    if (ticketIdRef.current) {
      fetchChatThread();
    }
  }, [authToken, fetchChatThread, ticketId, tokenReady]);

  const ensureSocketConnection = useCallback(async () => {
    try {
      let socketInstance = getSocket();
      if (!socketInstance || !socketInstance.connected) {
        const token =
          authToken || (await AsyncStorage.getItem('userToken'));
        if (!token) return null;
        socketInstance = connectSocket(token);
      }
      return socketInstance;
    } catch (error) {
      console.log('Failed to ensure socket connection:', error);
      return null;
    }
  }, [authToken]);

  const detachSocketListeners = useCallback((socketInstance) => {
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
  }, []);

  const markAsRead = useCallback(
    async (payload) => {
      const currentChatId = chatIdRef.current;
      if (!currentChatId) return;
      if (!authToken) return;

      const latestMessageId =
        payload?.data?._id ||
        payload?._id ||
        payload?.id ||
        (payload?.data?.messageId || null);

      if (lastReadMessageIdRef.current === latestMessageId) {
        return;
      }

      try {
        const url = `${API_ENDPOINTS.BASE_URL}/api/app/agent/chat/${currentChatId}/readAllMessages`;
        const response = await authorizedFetch(url, {
          method: 'PUT',
        });
        const data = await response.json();
        if (response.ok && data?.success) {
          lastReadMessageIdRef.current = latestMessageId;
        }
      } catch (error) {
        console.log('Mark as read error:', error);
      }
    },
    [authToken, authorizedFetch],
  );

  const attachSocketListeners = useCallback(
    (socketInstance) => {
      if (!socketInstance) return;

      if (
        attachedSocketRef.current === socketInstance &&
        socketMessageHandlerRef.current
      ) {
        return;
      }

      if (
        attachedSocketRef.current &&
        attachedSocketRef.current !== socketInstance
      ) {
        detachSocketListeners(attachedSocketRef.current);
      }

      const handler = (eventPayload) => {
        const payloads = Array.isArray(eventPayload)
          ? eventPayload
          : [eventPayload];
        payloads.forEach((payload) => {
          if (!payload) return;
          mergeIncomingMessage(payload?.data || payload);
          markAsRead(payload);
          if (!isAgentUser) {
            dispatch(fetchUnreadCounts());
          }
        });
      };

      socketInstance.on('new_message', handler);
      socketInstance.on('message_broadcast', handler);

      if (socketConnectHandlerRef.current) {
        socketInstance.off('connect', socketConnectHandlerRef.current);
      }

      const handleConnect = () => {
        if (ticketIdRef.current) {
          socketInstance.emit('join_ticket', ticketIdRef.current);
        }
      };

      socketInstance.on('connect', handleConnect);

      socketMessageHandlerRef.current = handler;
      socketConnectHandlerRef.current = handleConnect;
      attachedSocketRef.current = socketInstance;
    },
    [detachSocketListeners, dispatch, isAgentUser, markAsRead, mergeIncomingMessage],
  );

  useEffect(() => {
    let isMounted = true;
    let socketInstance;

    const registerSocketEvents = async () => {
      if (!tokenReady || !authToken) return;
      socketInstance = await ensureSocketConnection();
      if (!socketInstance || !isMounted) return;

      socketRef.current = socketInstance;
      attachSocketListeners(socketInstance);

      if (ticketIdRef.current) {
        socketInstance.emit('join_ticket', ticketIdRef.current);
      }
    };

    registerSocketEvents();

    return () => {
      isMounted = false;
      if (socketInstance) {
        if (ticketIdRef.current) {
          socketInstance.emit('leave_ticket', ticketIdRef.current);
        }
        detachSocketListeners(socketInstance);
      }
    };
  }, [
    attachSocketListeners,
    authToken,
    detachSocketListeners,
    ensureSocketConnection,
    tokenReady,
  ]);

  useEffect(() => {
    if (!userDetails) return;

    setMessages((prevMessages) =>
      prevMessages
        .map((message) => {
          const remapped = mapMessage(message.raw || message);
          return remapped || message;
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    );
  }, [userDetails, mapMessage]);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages]);

  const handleChangeText = useCallback((text) => {
    setInputText(text);
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    const currentChatId = chatIdRef.current;
    const currentTicketId = ticketIdRef.current;

    if (!trimmed || !currentTicketId) return;
    if (!authToken) {
      console.log('Unable to send message: missing auth token');
      return;
    }

    const now = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;

    const tempMessage = {
      id: tempId,
      text: trimmed,
      messageType: 'text',
      senderId: currentUserId,
      senderName: userDetails?.name || 'You',
      senderType: 'agent',
      createdAt: now,
      timestamp: formatTimestamp(now),
      isUser: true,
      status: 'pending',
      attachments: [],
      isSystem: false,
      clientMessageId: tempId,
    };

    setMessages((prev) =>
      [...prev, tempMessage].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ),
    );
    setInputText('');

    try {
      let socket = socketRef.current;
      if (!socket || !socket.connected) {
        socket = await ensureSocketConnection();
        if (socket) {
          socketRef.current = socket;
          if (currentTicketId) {
            socket.emit('join_ticket', currentTicketId);
          }
        }
      }

      if (!socket || !socket.connected) {
        throw new Error('Unable to connect to chat server.');
      }

      if (
        attachedSocketRef.current !== socket ||
        !socketMessageHandlerRef.current
      ) {
        attachSocketListeners(socket);
      }

      if (currentChatId) {
        socket.emit('send_message', {
          chatId: currentChatId,
          ticketId: currentTicketId,
          content: trimmed,
          messageType: 'text',
          clientMessageId: tempId,
        });
      }

      const sendPayload = {
        ticketId: currentTicketId,
        content: trimmed,
        chatId : currentChatId,
        messageType: 'text',
        clientMessageId: tempId,
      };
console.log(sendPayload);


      const trySend = async (url) => {
        try {
          const response = await authorizedFetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendPayload),
          });
          const data = await response.json().catch(() => null);
          if (response?.ok) {
            const payloadChat =
              data?.data?.chat || data?.chat || null;
            const nextChatId =
              data?.data?.chatId ||
              payloadChat?._id ||
              data?.chatId ||
              data?.chat?._id ||
              null;
            if (nextChatId && !chatIdRef.current) {
              chatIdRef.current = nextChatId;
              setChatId(nextChatId);
            }
            if (payloadChat) {
              setChatInfo(payloadChat);
            }

            const payloadTicket =
              data?.data?.ticket || data?.ticket || null;
            if (payloadTicket) {
              setTicketDetails(payloadTicket);
              const normalizedTicketId =
                payloadTicket?._id || payloadTicket?.ticketId || null;
              if (normalizedTicketId) {
                ticketIdRef.current = normalizedTicketId;
                setTicketId(normalizedTicketId);
              }
            }

            const returnedMessagesArray = Array.isArray(data?.data?.messages)
              ? data?.data?.messages
              : Array.isArray(data?.messages)
                ? data?.messages
                : null;
            const returnedMessage =
              data?.data?.message ||
              data?.message ||
              data?.data ||
              null;

            if (returnedMessagesArray && returnedMessagesArray.length > 0) {
              returnedMessagesArray.forEach((msg) => {
                mergeIncomingMessage(msg);
              });
            } else if (returnedMessage) {
              mergeIncomingMessage(returnedMessage);
            }
            return true;
          }
          console.log(`Agent chat send failed (${url}):`, data);
        } catch (apiError) {
          console.log(`Send message API error (${url}):`, apiError);
        }
        return false;
      };

      const overAgent = await trySend(
        `${API_ENDPOINTS.BASE_URL}/api/app/agent/chat/send`,
      );
      if (!overAgent) {
        throw new Error('Agent chat send failed');
      }

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) =>
            msg.id !== tempMessage.id &&
            msg.clientMessageId !== tempMessage.clientMessageId,
        );
        return filtered.map((msg) => {
          if (
            msg.status &&
            msg.status === 'pending' &&
            (msg.clientMessageId === tempId ||
              msg.raw?.clientMessageId === tempId ||
              msg.id === tempId)
          ) {
            return { ...msg, status: 'sent' };
          }
          return msg.status && msg.status === 'pending'
            ? { ...msg, status: 'sent' }
            : msg;
        });
      });
      fetchChatThread();
    
    } catch (error) {
      console.log('Send message error:', error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempMessage.id),
      );
    }
  }, [
    authToken,
    attachSocketListeners,
    authorizedFetch,
    currentUserId,
    ensureSocketConnection,
    formatTimestamp,
    inputText,
    fetchChatThread,
    mapMessage,
    userDetails?.name,
  ]);

  const renderMessage = ({ item }) => {
    if (item.isSystem) {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
          {item.timestamp ? (
            <Text style={styles.systemTimestamp}>{item.timestamp}</Text>
          ) : null}
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageContainer,
          item.isUser
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
    <View
      style={[
        styles.messageBubble,
            item.isUser
              ? styles.userMessageBubble
              : styles.otherMessageBubble,
          ]}
        >
          <Text style={styles.senderName}>
            {item.isUser ? 'You' : item.senderName || 'Customer'}
          </Text>
          <Text style={styles.messageText}>
            {item.text || 'Unsupported message type'}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
    </View>
  );
  };

  const ticketNumber =
    ticketDetails?.ticketNumber ||
    ticketDetails?.ticketId ||
    customer?.name ||
    'N/A';
  const customerName =
    ticketDetails?.customer?.name ||
    ticketDetails?.participants?.find?.((p) => p?.userType === 'customer')
      ?.userName ||
    customer?.customer ||
    'Customer';

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
        <View style={[flexDirectionRow, alignItemsCenter, { flex: 1 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={whiteColor} />
        </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{customerName}</Text>
            <Text style={styles.headerSubTitle}>
              Ticket #{ticketNumber}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDropdownVisible((prev) => !prev)}
        >
          <Entypo name="dots-three-vertical" size={20} color={whiteColor} />
        </TouchableOpacity>
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              onPress={() => {
                setDropdownVisible(false);
                const customerId =
                  ticketDetails?.customer?._id ||
                  ticketDetails?.customerId ||
                  ticketDetails?.customer?._id ||
                  customer?.__raw?.customer?._id;
                if (customerId) {
                  navigation.navigate('CustomerDetails', {
                    customerId,
                    ticketNumber,
                  });
                }
              }}
            >
              <Text style={styles.dropdownMenuItem}>
                View Customer Information
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.flexGrow}
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
              multiline
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AgentChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColor,
  },
  flexGrow: {
    flex: 1,
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
  headerSubTitle: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: whiteColor,
    marginTop: 2,
  },
  menuButton: {
    padding: spacings.small,
  },
  dropdownMenu: {
    position: 'absolute',
    right: spacings.medium,
    top: spacings.xxLarge + spacings.small,
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    paddingVertical: spacings.small,
    paddingHorizontal: spacings.medium,
    zIndex: 100,
    elevation: 4,
  },
  dropdownMenuItem: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
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
  otherMessageContainer: {
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
  otherMessageBubble: {
    backgroundColor: lightBlack,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    lineHeight: 20,
    color: whiteColor,
  },
  senderName: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightMedium,
    color: lightGrayColor,
    marginBottom: spacings.xsmall,
  },
  timestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginTop: spacings.xsmall,
    alignSelf: 'flex-end',
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginBottom: spacings.medium,
  },
  systemMessageText: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightMedium,
    color: whiteColor,
    backgroundColor: lightBlack,
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small,
    borderRadius: 20,
    textAlign: 'center',
  },
  systemTimestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginTop: spacings.xsmall,
  },
  emptyStateText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: lightGrayColor,
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
    backgroundColor: lightBlack,
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
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: lightPinkAccent,
    margin: spacings.small,
  },
  disabledSendButton: {
    backgroundColor: lightBlack,
  },
});
