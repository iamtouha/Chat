import { Server } from 'socket.io';
import { conversationsSocket } from './conversations.socket.js';
import { messagesSocket } from './messages.socket.js';
import { getMapKeyByValue, getMapKeysByValue } from '../lib/helpers.js';

const socketIdMap = new Map<string, string>();
const apikeyMap = new Map<string, string>();

export const initializeSocket = (io: Server) => {
  io.of('/socket.io').on('connection', (socket) => {
    socket.on('user_connected', (id: string, apikey?: string) => {
      socketIdMap.set(id, socket.id);
      if (!apikey) {
        const joinedConversations = getMapKeysByValue(apikeyMap, id);
        socket.emit('joined_conversations', joinedConversations);
        return;
      }
      apikeyMap.set(id, apikey);
      const clientSocketId = socketIdMap.get(apikey);
      if (clientSocketId)
        socket.to(clientSocketId).emit('joined_conversation', id);
    });

    socket.on('disconnect', () => {
      const id = getMapKeyByValue(socketIdMap, socket.id);
      socketIdMap.forEach((value, key) => {
        if (value === socket.id) socketIdMap.delete(key);
      });

      const apikey = id ? apikeyMap.get(id) : null;
      id && apikeyMap.delete(id);

      const clientSocketId = apikey ? socketIdMap.get(apikey) : null;
      if (clientSocketId)
        socket.to(clientSocketId).emit('left_conversation', id);
    });

    conversationsSocket(socket, socketIdMap);
    messagesSocket(socket, socketIdMap);
  });
};
