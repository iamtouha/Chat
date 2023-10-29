import { Socket } from 'socket.io';
import type { SocketIdMap } from './_main.js';
import { getMapKey } from '../lib/utils.js';

export const messagesSocket = (socket: Socket, socketIdMap: SocketIdMap) => {
  socket.on('message_sent', (payload) => {
    const { apikey } = socketIdMap.get(socket.id) || {};

    if (apikey) {
      socket.to(apikey).emit('message_received', payload);
      return;
    }
    const convId = payload.conversationId as string | undefined;
    const receiverSocketId = getMapKey(socketIdMap, (v) => v.id === convId);
    if (!receiverSocketId) return;
    socket.to(receiverSocketId).emit('message_received', payload);
  });

  socket.on('message_update_sent', (payload, key: string) => {
    const { apikey } = socketIdMap.get(socket.id) || {};

    if (apikey) {
      socket.to(apikey).emit('message_updated', payload, key);
      return;
    }

    const convId = payload.conversationId as string | undefined;
    const receiverSocketId = getMapKey(socketIdMap, (v) => v.id === convId);

    if (!receiverSocketId) return;
    socket.to(receiverSocketId).emit('message_updated', payload, key);
  });
};
