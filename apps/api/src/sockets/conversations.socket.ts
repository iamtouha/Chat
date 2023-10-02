import { Socket } from 'socket.io';

export const conversationsSocket = (
  socket: Socket,
  socketIdMap: Map<string, string>,
) => {
  socket.on('conversation_started', (payload, clientId: string) => {
    const clientSocketId = socketIdMap.get(clientId);
    if (!clientSocketId) return;
    socket.to(clientSocketId).emit('conversation_started', payload);
  });
};
