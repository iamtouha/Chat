import { Socket } from 'socket.io';

export const messagesSocket = (
  socket: Socket,
  socketIdMap: Map<string, string>,
) => {
  socket.on('message_sent', (payload, receiverId: string) => {
    console.log('message_sent to, ', receiverId);
    const clientSocketId = socketIdMap.get(receiverId);

    if (!clientSocketId) {
      console.log('clientSocketId not found', receiverId, socketIdMap);
      return;
    }
    socket.to(clientSocketId).emit('message_received', payload);
  });
};
