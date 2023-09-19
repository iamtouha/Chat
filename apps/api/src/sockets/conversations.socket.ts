import { Socket } from 'socket.io';

export const conversationsSocket = (
  socket: Socket,
  socketIdMap: Map<string, string>,
) => {
  socket.on('conversation_started', (payload, clientId: string) => {
    const clientSocketId = socketIdMap.get(clientId);

    console.log('conversation_started', payload, clientId, clientSocketId);
    if (!clientSocketId) {
      console.log('Client not found');
      return;
    }
    socket.to(clientSocketId).emit('conversation_started', payload);
  });
};
