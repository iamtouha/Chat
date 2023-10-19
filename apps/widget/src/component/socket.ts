import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_APP_SERVER_URL}/api/v1`);
export default socket;
