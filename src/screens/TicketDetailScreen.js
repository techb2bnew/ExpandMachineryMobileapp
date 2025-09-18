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
  Alert,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { darkgrayColor, whiteColor, lightGrayColor, grayColor, lightBlack, lightColor, lightPinkAccent, supportGreen, redColor, greenColor } from '../constans/Color';
import { style, spacings } from '../constans/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { BaseStyle } from '../constans/Style';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmationModal from '../components/Modals/ConfirmationModal';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

const TicketDetailScreen = ({ navigation, route }) => {
  const { ticket } = route.params;

  // Use ticket data from inbox, add missing fields with static data
  const ticketData = {
    id: 'EXP87654321',
    title: ticket.title || 'Software license activation',
    status: isUnread ? 'In Progress' : 'Resolved', // Dynamic status based on isUnread
    updatedDate: ticket.updatedDate || '21/01/2024',
    machine: ticket.machine || 'Genturn 2540',
    serial: ticket.serial || 'GT2540-2023-015',
    category: ticket.category || 'Applications Support',
    createdDate: ticket.createdDate || '18/01/2024',
    description: ticket.description || 'Unable to activate new CAM software license',
    messages: ticket.messages || [
      {
        id: 1,
        text: 'I received the new CAM software license key but I\'m unable to activate it. Getting error code AL-404.',
        isUser: true,
        timestamp: '7:30 PM',
        date: 'Jan 18',
        sender: 'John Smith'
      },
      {
        id: 2,
        text: 'I see you\'re getting error AL-404. This usually means the license server can\'t validate the key. Can you confirm you\'re connected to the internet and try again?',
        isUser: false,
        timestamp: '8:00 PM',
        date: 'Jan 18',
        sender: 'Mike Chen'
      },
      {
        id: 3,
        text: 'Yes, I\'m connected to the internet. I\'ve tried multiple times but still getting the same error.',
        isUser: true,
        timestamp: '8:30 PM',
        date: 'Jan 18',
        sender: 'John Smith'
      },
      {
        id: 4,
        text: 'Let me check the license key in our system. I\'ll get back to you within 24 hours with a solution.',
        isUser: false,
        timestamp: '2:30 PM',
        date: 'Jan 21',
        sender: 'Mike Chen'
      }
    ]
  };

  const [messages, setMessages] = useState(ticketData.messages);
  const [inputText, setInputText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isUnread, setIsUnread] = useState(ticket.isUnread || false); // Use ticket.isUnread from inbox
  const flatListRef = useRef(null);

  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      if (Platform.OS === "android") {
        setKeyboardOffset(30); 
      }
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      if (Platform.OS === "android") {
        setKeyboardOffset(0); 
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');

      // Simulate support response after 2 seconds
      setTimeout(() => {
        const supportResponse = {
          id: Date.now() + 1,
          text: "Thank you for your message. Our support team will review and respond shortly.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString(),
        };
        setMessages(prev => [...prev, supportResponse]);
      }, 2000);
    }
  };

  const handleDeleteConversation = () => {
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const confirmDelete = () => {
    console.log('Deleting conversation for ticket:', ticket.id);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  const getStatusColor = (status) => {
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

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.supportMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userMessageBubble : styles.supportMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.supportMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <View style={styles.messageFooter}>
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.timestamp}>• {item.date}, {item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
        <View style={[flexDirectionRow, alignItemsCenter]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={whiteColor} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{ticketData.title}</Text>
            <Text style={styles.ticketNumber}>{ticketData.id}</Text>
          </View>
          <View style={[flexDirectionRow, alignItemsCenter]}>
            {!isUnread && (
              <Icon name="checkmark-circle" size={24} color={greenColor} style={styles.statusIcon} />
            )}
            {isUnread && (
              <Icon name="alert-circle-outline" size={24} color={redColor} style={styles.statusIcon} />
            )}
            <TouchableOpacity onPress={handleMenuPress}>
              <Icon name="ellipsis-vertical" size={24} color={whiteColor} />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* Ticket Details */}
      <View style={styles.detailsCard}>
        <View style={[styles.statusRow, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticketData.status) }]}>
            <Text style={styles.statusText}>{ticketData.status}</Text>
          </View>
          <Text style={styles.updatedDate}>Updated {ticketData.updatedDate}</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Machine:</Text>
            <Text style={styles.detailValue}>{ticketData.machine}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Serial:</Text>
            <Text style={styles.detailValue}>{ticketData.serial}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{ticketData.category}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{ticketData.createdDate}</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionLabel}>Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{ticketData.description}</Text>
          </View>
        </View>
      </View>

      {/* Conversation + Input wrapped inside KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : keyboardOffset}
      >
        {/* Conversation Section */}
        <View style={styles.conversationSection}>
          <Text style={styles.conversationTitle}>Conversation</Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input Area - Only show for unread tickets */}
        {isUnread && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reply to support team</Text>
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
                  !inputText.trim() && styles.disabledSendButton
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
        )}
      </KeyboardAvoidingView>

      {/* Popup Menu */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteConversation}
            >
              <Icon name="trash-outline" size={20} color={lightPinkAccent} />
              <Text style={styles.menuItemText}>Delete this conversation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        iconName="trash-outline"
      />
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
    color: lightGrayColor,
    marginTop: 2,
  },
  statusIcon: {
    marginRight: spacings.medium,
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
  updatedDate: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
  },
  detailsGrid: {
    marginBottom: spacings.large,
  },
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
  },
  descriptionText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
  },
  resolutionBox: {
    borderRadius: 8,
    padding: spacings.medium,
  },
  resolutionText: {
    ...style.fontSizeNormal,
    ...style.fontWeightThin,
    color: whiteColor,
    lineHeight: 20,
  },
  conversationSection: {
    flex: 1,
    paddingHorizontal: spacings.large,
  },
  conversationTitle: {
    ...style.fontSizeMedium,
    ...style.fontWeightBold,
    color: whiteColor,
    marginBottom: spacings.medium,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
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
    backgroundColor: "#490517",
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
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacings.xsmall,
  },
  senderName: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightMedium,
    color: whiteColor,
  },
  timestamp: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginLeft: spacings.xsmall,
  },
  inputContainer: {
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
    borderTopWidth: 1,
    borderTopColor: grayColor,
  },
  inputLabel: {
    ...style.fontSizeSmall1x,
    ...style.fontWeightThin,
    color: lightGrayColor,
    marginBottom: spacings.small,
  },
  inputArea: {
    backgroundColor: lightBlack,
    borderRadius: 20,
    paddingHorizontal: spacings.medium,
    paddingVertical: spacings.small,
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
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: lightBlack,
    borderRadius: 8,
    paddingVertical: spacings.small,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.medium,
  },
  menuItemText: {
    ...style.fontSizeNormal,
    ...style.fontWeightMedium,
    color: lightPinkAccent,
    marginLeft: spacings.medium,
  },
});

export default TicketDetailScreen;
