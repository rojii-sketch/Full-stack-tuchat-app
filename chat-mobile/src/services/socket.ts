import { io } from 'socket.io-client';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') || 'https://tuchat-backend.onrender.com';
export const SOCKET_URL = API_BASE_URL;
export const API_URL = `${API_BASE_URL}/api/auth`;

export const socket = io(SOCKET_URL, { 
  autoConnect: false,
  transports: ['websocket', 'polling'], // Allows fallback if direct websocket is blocked during cold start
  timeout: 30000 // Increases connection timeout window to 30 seconds for Render cold starts
});