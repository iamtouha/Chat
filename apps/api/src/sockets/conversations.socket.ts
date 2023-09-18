import { Socket } from 'socket.io';

export const conversationsSocket = (
  socket: Socket,
  socketIdMap: Map<string, string>,
) => {
  socket.on('conversation_started', (clientId: string) => {
    const clientSocketId = socketIdMap.get(clientId);
    console.log('conversation_started', clientId, clientSocketId);
    if (!clientSocketId) return;

    socket.to(clientSocketId).emit('conversation_started');
  });
};
