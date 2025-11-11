import { io } from 'socket.io-client';

// DEV URL
// const SOCKET_URL = 'http://localhost:9000'; 
// PRODUCTION URL (for later deployment)
const SOCKET_URL = 'https://expand.shabad-guru.org';

let socket;

export const connectSocket = (token) => {
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  // Connection confirmation
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  socket.on('error', (err) => {
    console.log('⚠️ Socket error:', err);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    try {
      socket.removeAllListeners();
    } catch (error) {
      console.log('⚠️ Error removing socket listeners:', error);
    }
    socket.disconnect();
    socket = null;
  }
};
