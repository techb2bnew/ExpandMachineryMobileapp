import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import colors from '../constans/Color';
import { SafeAreaView } from 'react-native-safe-area-context';

const AgentChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'user',
      text: 'The main lens on my 3D scanner has a crack and needs replacement.',
      time: '16:50',
      type: 'description',
    },
    {
      id: '2',
      sender: 'user',
      text: '3D Scanner XL\nSerial: SCN005678',
      time: '16:50',
      type: 'equipment',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => {
      const replyMsg = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'How can I help you?',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 3000);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      {item.type === 'description' && (
        <Text style={styles.title}>Description</Text>
      )}
      {item.type === 'equipment' && <Text style={styles.title}>Equipment</Text>}
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.time}>{item.time} • Read</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginBottom: 14 }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 4 }}>
          <Text style={styles.userName}>Sarah Johnson</Text>
          <Text style={styles.onlineText}>● Online</Text>
        </View>

        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Icon name="dots-vertical" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Dropdown */}
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                setDropdownVisible(false);
                navigation.navigate('CustomerDetails');
              }}
            >
              <Text style={styles.dropdownItem}>Customer Information</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Chat */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={{ color: colors.cardBg, fontSize: 18 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AgentChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 0.2,
    borderBottomColor: '#fff',
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  onlineText: {
    color: colors.online,
    fontSize: 12,
  },
  dropdown: {
    position: 'absolute',
    right: 10,
    top: 45,
    backgroundColor: colors.textPrimary,
    borderRadius: 8,
    padding: 8,
    elevation: 4,
    zIndex: 99999,
  },
  dropdownItem: {
    color: colors.cardBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chatContainer: {
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.messageUser,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.messageBot,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  time: {
    fontSize: 10,
    color: colors.textSecondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: colors.inputBackground,
    fontSize: 15,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: colors.textPrimary,
    borderRadius: 12,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
