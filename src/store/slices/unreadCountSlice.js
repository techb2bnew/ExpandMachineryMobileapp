import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithAuth, checkAuthError } from '../../utils';
import { API_ENDPOINTS } from '../../constans/Constants';

// Fetch unread counts from API
export const fetchUnreadCounts = createAsyncThunk(
  'unreadCount/fetchUnreadCounts',
  async (_, { rejectWithValue }) => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        return {
          inboxUnread: 0,
          chatUnread: 0,
        };
      }

      // Fetch inbox unread count
      const inboxUrl = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox?filter=unread&limit=100&page=1`;
      const inboxResponse = await fetchWithAuth(inboxUrl, {
        method: 'GET',
        suppressLogoutOnAuthError: true,
      });
      const inboxData = await inboxResponse.json();

      let inboxCount = 0;
      if (inboxResponse.ok && inboxData?.success) {
        // Get total count from pagination or calculate from data
        if (inboxData?.data?.pagination?.total !== undefined) {
          inboxCount = inboxData.data.pagination.total;
        } else if (inboxData?.data?.conversations) {
          inboxCount = inboxData.data.conversations.filter(c => c?.isRead === false).length;
        }
      }

      // Fetch chat unread count
      const chatUrl = `${API_ENDPOINTS.BASE_URL}/api/app/chat/list?limit=100&page=1`;
      const chatResponse = await fetchWithAuth(chatUrl, {
        method: 'GET',
        suppressLogoutOnAuthError: true,
      });
      const chatData = await chatResponse.json();

      let chatCount = 0;
      if (chatResponse.ok && chatData?.success) {
        // Calculate unread count from chat list
        const chats = Array.isArray(chatData?.data) ? chatData.data : [];
        chatCount = chats.filter(c => c?.lastMessageRead === false || c?.lastMessageRead === undefined).length;
      }

      console.log('✅ Unread counts fetched:', { inbox: inboxCount, chat: chatCount });

      return {
        inboxUnread: inboxCount,
        chatUnread: chatCount,
      };
    } catch (error) {
      console.log('❌ Fetch unread counts error:', error);
      const message = error?.message ?? 'Failed to fetch unread counts';

      if (checkAuthError(message) || message === 'No authentication token') {
        // Treat as zero counts but avoid forcing logout during login flow
        return {
          inboxUnread: 0,
          chatUnread: 0,
        };
      }

      return rejectWithValue(message);
    }
  }
);

export const fetchNotificationsUnreadCount = createAsyncThunk(
  'unreadCount/fetchNotificationsUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (!storedToken) {
        return 0;
      }

      const url = `${API_ENDPOINTS.BASE_URL}/api/app/notifications?page=1&limit=1`;
      const response = await fetchWithAuth(url, {
        method: 'GET',
        suppressLogoutOnAuthError: true,
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data?.message || 'Failed to fetch notification count';
        throw new Error(message);
      }

      const unread = typeof data?.unreadCount === 'number' ? data.unreadCount : 0;

      return unread;
    } catch (error) {
      console.log('❌ Fetch notifications unread count error:', error);
      const message = error?.message ?? 'Failed to fetch notification count';

      if (checkAuthError(message) || message === 'No authentication token') {
        return 0;
      }

      return rejectWithValue(message);
    }
  }
);

const unreadCountSlice = createSlice({
  name: 'unreadCount',
  initialState: {
    inboxUnread: 0,
    chatUnread: 0,
    notificationsUnread: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    updateInboxUnreadCount: (state, action) => {
      state.inboxUnread = action.payload;
    },
    updateChatUnreadCount: (state, action) => {
      state.chatUnread = action.payload;
    },
    updateNotificationsUnreadCount: (state, action) => {
      state.notificationsUnread = action.payload;
    },
    resetUnreadCounts: (state) => {
      state.inboxUnread = 0;
      state.chatUnread = 0;
      state.notificationsUnread = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadCounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnreadCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inboxUnread = action.payload.inboxUnread;
        state.chatUnread = action.payload.chatUnread;
        state.error = null;
      })
      .addCase(fetchUnreadCounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchNotificationsUnreadCount.fulfilled, (state, action) => {
        state.notificationsUnread = action.payload;
      })
      .addCase(fetchNotificationsUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  updateInboxUnreadCount,
  updateChatUnreadCount,
  updateNotificationsUnreadCount,
  resetUnreadCounts,
} = unreadCountSlice.actions;
export default unreadCountSlice.reducer;

