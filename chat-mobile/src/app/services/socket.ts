import { io } from 'socket.io-client';

export const SOCKET_URL = 'http://localhost:3000';
export const API_URL = 'http://localhost:3000/api/auth';

export const socket = io(SOCKET_URL, { autoConnect: false });