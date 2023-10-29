import { Socket } from 'socket.io';
import type { SocketIdMap } from './_main.js';

export const conversationsSocket = (
  socket: Socket,
  socketIdMap: SocketIdMap,
) => {
  socket.on('conversation_started', (payload) => {
    const { apikey } = socketIdMap.get(socket.id) || {};
    if (!apikey) return;
    socket.to(apikey).emit('conversation_started', payload);
  });
};
