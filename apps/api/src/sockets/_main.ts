import { Server } from 'socket.io';
import { conversationsSocket } from './conversations.socket.js';
import { messagesSocket } from './messages.socket.js';
import { getMapKey, getMapKeys } from '../lib/utils.js';

export type SocketIdMap = Map<string, { id: string; apikey: string | null }>;

const socketIdMap: SocketIdMap = new Map();

export const initializeSocket = (io: Server) => {
  io.of('/socket.io').on('connection', (socket) => {
    socket.on('user_connected', (id: string, apikey?: string) => {
      socketIdMap.set(socket.id, { id, apikey: apikey ?? null });

      if (!apikey) {
        socket.join(id);
        const activeIds = getMapKeys(socketIdMap, (v) => v.apikey === id);
        socket.emit(
          'joined_conversations',
          activeIds.map((v) => socketIdMap.get(v)?.id),
        );
        return;
      }
      socket.to(apikey).emit('joined_conversation', id);
    });

    socket.on('disconnect', () => {
      const { apikey, id } = socketIdMap.get(socket.id) || {};
      socketIdMap.delete(socket.id);
      if (apikey) socket.to(apikey).emit('left_conversation', id);
    });

    conversationsSocket(socket, socketIdMap);
    messagesSocket(socket, socketIdMap);
  });
};
