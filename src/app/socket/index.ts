import { io } from "socket.io-client";

const url = process.env.SOCKET_BASE_URL || '';

const socket = io(url);

export default socket;