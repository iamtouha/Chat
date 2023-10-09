import { Socket } from 'socket.io';

export const messagesSocket = (
  socket: Socket,
  socketIdMap: Map<string, string>,
) => {
  socket.on('message_sent', (payload, receiverId: string) => {
    const clientSocketId = socketIdMap.get(receiverId);

    if (!clientSocketId) return;

    socket.to(clientSocketId).emit('message_received', payload);
  });

  socket.on(
    'message_update_sent',
    (payload, receiverId: string, key: string) => {
      const clientSocketId = socketIdMap.get(receiverId);
      if (!clientSocketId) return;
      socket.to(clientSocketId).emit('message_updated', payload, key);
    },
  );
};
