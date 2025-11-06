import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    darkgrayColor,
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
    fetchWithAuth,
} from '../utils';
import { BaseStyle } from '../constans/Style';
import { API_ENDPOINTS } from '../constans/Constants';
import { useFocusEffect } from '@react-navigation/native';

const { flex, alignJustifyCenter, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween } = BaseStyle;

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState('');

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

    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        } catch (error) {
            return '';
        }
    };

    const mapConversations = (conversations = []) => {
        return conversations.map((conv) => {
            // Extract ticket info from ticketId object
            const ticketIdObj = conv?.ticketId || {};
            const ticketId = ticketIdObj?._id || conv?._id;

            // Extract agent from participants array
            const agentParticipant = conv?.participants?.find(
                p => p?.userType === 'agent'
            ) || null;

            // Format lastMessageAt time
            let displayTime = null;
            if (conv?.lastMessageAt) {
                displayTime = formatTime(conv.lastMessageAt);
            } else if (conv?.createdAt) {
                displayTime = formatTime(conv.createdAt);
            }

            // Check read status from lastMessageRead field
            const isRead = conv?.lastMessageRead === true;

            return {
                id: conv?._id,
                ticketId: ticketId, // Use ticketId._id for navigation
                title: ticketIdObj?.description || 'Support Ticket',
                ticketNumber: ticketIdObj?.ticketNumber || 'N/A',
                description: ticketIdObj?.description || '',
                lastMessage: conv?.lastMessage || '',
                lastMessageTime: displayTime,
                isRead: isRead, // true if lastMessageRead is true, false otherwise
                status: ticketIdObj?.status || 'pending',
                assignedAgent: agentParticipant ? {
                    _id: agentParticipant.userId,
                    name: agentParticipant.userName,
                    email: agentParticipant.userEmail,
                } : null,
                messageId: conv?.messageId || null, // Include messageId for read API
            };
        });
    };

    const buildQuery = (resetPage = false) => {
        const currentPage = resetPage ? 1 : page;
        const params = new URLSearchParams({
            page: String(currentPage),
            limit: '10',
        });
        if (searchText.trim()) {
            params.append('search', searchText.trim());
        }
        return params.toString();
    };

    const loadChats = useCallback(async (reset = false, showFullRefresh = false) => {
        // Don't block if already loading (for pagination)
        if (isLoading && !reset) return;

        try {
            // Full refresh only for pull-to-refresh
            if (reset && showFullRefresh) {
                setIsRefreshing(true);
            } else if (reset) {
                // Tab change or search: soft loading, keep existing data visible
                // Only show full screen loading if no data exists
                if (chats.length === 0) {
                    setIsLoading(true);
                }
            } else {
                // Pagination: normal loading
                setIsLoading(true);
            }

            const qs = buildQuery(reset);
            const url = `${API_ENDPOINTS.BASE_URL}/api/app/chat/list?${qs}`;
            const response = await fetchWithAuth(url, { method: 'GET' });
            const data = await response.json();
            console.log('datachat list:::::::', data);

            if (response.ok && data?.success) {
                // New API returns array directly in data, not wrapped in conversations
                const conv = Array.isArray(data?.data) ? data.data : [];
                const pagination = data?.pagination || {};
                const nextItems = mapConversations(conv);

                if (reset) {
                    setChats(nextItems);
                    setPage(1);
                } else {
                    setChats(prev => [...prev, ...nextItems]);
                }
                setTotalPages(pagination?.totalPages || 1);
            }
        } catch (error) {
            console.log('Chat list fetch error:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [page, isLoading, searchText, chats.length]);

    // Mark ticket/message as read
    const markAsRead = async (chat) => {
        // Only mark as read if it's unread
        if (chat?.isRead) return;

        try {
            // Use messageId directly from chat object
            if (chat?.messageId) {
                const url = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox/${chat.messageId}/read`;
                console.log('url:::::::', url);

                const response = await fetchWithAuth(url, { method: 'PUT' });
                const data = await response.json();
                console.log('data:::::::', data);

                if (response.ok && data?.success) {
                    // Refresh data to get updated read status from API
                    loadChats(true, false);
                } else {
                    console.log('Failed to mark as read:', data?.message || 'Unknown error');
                }
            } else if (chat?.ticketId) {
                // Fallback: if no message ID, use ticket read API
                const url = `${API_ENDPOINTS.BASE_URL}/api/app/tickets/${chat.ticketId}/read`;
                console.log('url (ticket):::::::', url);

                const response = await fetchWithAuth(url, { method: 'PUT' });
                const data = await response.json();

                if (response.ok && data?.success) {
                    // Refresh data to get updated read status from API
                    loadChats(true, false);
                } else {
                    console.log('Failed to mark as read:', data?.message || 'Unknown error');
                }
            }
        } catch (error) {
            console.log('Mark as read error:', error);
        }
    };

    // Filter chats based on search text
    const filteredChats = useMemo(() => {
        if (!searchText.trim()) {
            return chats;
        }
        const searchLower = searchText.toLowerCase();
        return chats.filter(chat => {
            const ticketNumber = chat.ticketNumber?.toLowerCase() || '';
            const agentName = chat.assignedAgent?.name?.toLowerCase() || '';
            const description = chat.description?.toLowerCase() || '';
            return ticketNumber.includes(searchLower) ||
                agentName.includes(searchLower) ||
                description.includes(searchLower);
        });
    }, [chats, searchText]);

    useEffect(() => {
        // Initial load and refresh on focus
        loadChats(true, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // When search changes, reset and reload
        setPage(1);
        loadChats(true, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    const handleEndReached = () => {
        if (isLoading) return;
        if (page >= totalPages) return;
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (page > 1) {
            loadChats(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useFocusEffect(
        useCallback(() => {
            loadChats(true, false);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const handleChatPress = (chat) => {
        console.log('chat', chat);
        // Mark as read when chat is clicked
        markAsRead(chat);
        // Navigate to chat screen with all data
        navigation.navigate('SupportChat', {
            ticketId: chat.ticketId,
            ticketNumber: chat.ticketNumber,
            supportType: 'Support',
            description: chat.description,
            status: chat.status,
            title: chat.title,
        });
    };

    const renderChatItem = ({ item }) => {
        const isUnread = !item.isRead;

        return (
            <TouchableOpacity
                style={styles.chatCard}
                activeOpacity={0.9}
                onPress={() => handleChatPress(item)}
            >
                <View style={styles.chatContent}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: lightPinkAccent, borderRadius: 100 },
                        ]}
                    >
                        <MaterialIcons name="message" size={20} color={whiteColor} />
                    </View>
                    <View style={styles.chatTextContainer}>
                        <View style={[flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
                            <Text style={styles.chatTitle}>{`Ticket ${item.ticketNumber}`}</Text>
                            <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
                        </View>
                        <Text style={styles.chatSender}>
                            Expand Supoort Team                            {/* {item.assignedAgent?.name || 'No agent assigned'} */}
                        </Text>

                        {/* <Text style={styles.chatPreview} numberOfLines={2}>
                            {item.lastMessage || item.description || 'No messages yet'}
                        </Text> */}
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.container]}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Chats</Text>
                        <Text style={styles.headerSubtitle}>Start or continue conversations with support</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Icon name="search" size={20} color={grayColor} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Ticket Number"
                        placeholderTextColor={grayColor}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View style={styles.contentContainer}>
                    {/* Chat List */}
                    {isLoading && chats.length === 0 ? (
                        <View style={[styles.emptyContainer, alignJustifyCenter]}>
                            <ActivityIndicator size="large" color={whiteColor} />
                        </View>
                    ) : filteredChats.length > 0 ? (
                        <FlatList
                            data={filteredChats}
                            renderItem={renderChatItem}
                            keyExtractor={item => String(item.id)}
                            contentContainerStyle={styles.chatList}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.5}
                            onEndReached={handleEndReached}
                            ListFooterComponent={
                                isLoading && chats.length > 0 ? (
                                    <View style={styles.loadingFooter}>
                                        <ActivityIndicator size="small" color={whiteColor} />
                                    </View>
                                ) : null
                            }
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={() => loadChats(true, true)}
                                    tintColor={whiteColor}
                                    colors={[whiteColor]}
                                    progressBackgroundColor={lightBlack}
                                />
                            }
                        />
                    ) : (
                        <View style={[styles.emptyContainer, alignJustifyCenter]}>
                            <Icon name="chatbubbles-outline" size={50} color={grayColor} />
                            <Text style={styles.emptyTitle}>No chats found</Text>
                            <Text style={styles.emptyText}>
                                {searchText.trim() ? 'No conversations match your search' : 'Your conversations will appear here'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChatListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightColor,
        width: wp(100),
        height: hp(100),
    },
    headerContainer: {
        paddingHorizontal: spacings.xLarge,
        paddingTop: spacings.xxLarge,
        paddingBottom: spacings.large,
        backgroundColor: lightColor,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: spacings.xLarge,
        paddingHorizontal: spacings.xxLarge
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
        marginHorizontal: spacings.xLarge,
        marginBottom: spacings.large,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: spacings.xLarge,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacings.medium,
        color: whiteColor,
        fontSize: style.fontSizeNormal.fontSize,
    },
    chatList: {
        paddingBottom: spacings.xxLarge,
    },
    chatCard: {
        backgroundColor: lightBlack,
        borderRadius: 12,
        marginBottom: spacings.medium,
        padding: spacings.xLarge,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: lightColor,
    },
    chatContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: wp(12),
    height: Platform.OS === 'ios' ? hp(5.5) : hp(6),
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacings.large,
    },
    chatTextContainer: {
        flex: 1,
    },
    chatTitle: {
        ...style.fontSizeNormal,
        ...style.fontWeightBold,
        color: whiteColor,
        marginBottom: spacings.small,
    },
    chatSender: {
        ...style.fontSizeSmall1x,
        ...style.fontWeightThin,
        color: whiteColor,
        opacity: 0.7,
    },
    chatTime: {
        ...style.fontSizeSmall1x,
        ...style.fontWeightThin,
        color: lightGrayColor,
        opacity: 0.7,
    },
    chatPreview: {
        ...style.fontSizeNormal,
        ...style.fontWeightThin,
        color: whiteColor,
        opacity: 0.9,
        lineHeight: 20,
        marginTop: spacings.xsmall,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: lightPinkAccent,
        marginLeft: spacings.medium,
        marginTop: spacings.small,
    },
    emptyContainer: {
        flex: 1,
        paddingVertical: spacings.xxLarge,
    },
    emptyTitle: {
        ...style.fontSizeNormal,
        ...style.fontWeightBold,
        color: whiteColor,
        marginTop: spacings.large,
        marginBottom: spacings.small,
    },
    emptyText: {
        ...style.fontSizeSmall1x,
        ...style.fontWeightThin,
        color: grayColor,
    },
    loadingFooter: {
        padding: spacings.large,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

