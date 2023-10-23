import { io } from 'socket.io-client';

const socket = io(
  import.meta.env.DEV ? import.meta.env.VITE_APP_SOCKET_URL : '/socket.io',
  { autoConnect: false },
);

export default socket;
