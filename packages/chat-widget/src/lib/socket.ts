import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { socketUrl } from '../variables';

const socket: Socket = io(socketUrl);
export default socket;
