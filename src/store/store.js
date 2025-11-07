import { configureStore } from '@reduxjs/toolkit';
import unreadCountReducer from './slices/unreadCountSlice';

export const store = configureStore({
  reducer: {
    unreadCount: unreadCountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

