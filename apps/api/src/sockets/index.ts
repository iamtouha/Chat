import { Server } from 'socket.io';
import { conversationsSocket } from './conversations.socket.js';
import { messagesSocket } from './messages.socket.js';

const socketIdMap = new Map<string, string>();

export const initializeSocket = (io: Server) => {
  io.of('/api/v1').on('connection', (socket) => {
    socket.on('user_connected', (id) => {
      socketIdMap.set(id, socket.id);
    });
    socket.on('disconnect', () => {
      socketIdMap.forEach((value, key) => {
        if (value === socket.id) socketIdMap.delete(key);
      });
    });

    conversationsSocket(socket, socketIdMap);
    messagesSocket(socket, socketIdMap);
  });
};
