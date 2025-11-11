import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithAuth } from '../../utils';
import { API_ENDPOINTS } from '../../constans/Constants';

// Fetch unread counts from API
export const fetchUnreadCounts = createAsyncThunk(
  'unreadCount/fetchUnreadCounts',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch inbox unread count
      const inboxUrl = `${API_ENDPOINTS.BASE_URL}/api/app/support-inbox?filter=unread&limit=100&page=1`;
      const inboxResponse = await fetchWithAuth(inboxUrl, { method: 'GET' });
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
      const chatResponse = await fetchWithAuth(chatUrl, { method: 'GET' });
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
      return rejectWithValue(error.message);
    }
  }
);

const unreadCountSlice = createSlice({
  name: 'unreadCount',
  initialState: {
    inboxUnread: 0,
    chatUnread: 0,
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
    resetUnreadCounts: (state) => {
      state.inboxUnread = 0;
      state.chatUnread = 0;
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
      });
  },
});

export const { updateInboxUnreadCount, updateChatUnreadCount, resetUnreadCounts } = unreadCountSlice.actions;
export default unreadCountSlice.reducer;

