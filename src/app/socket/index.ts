import { io } from "socket.io-client";

const url = process.env.REACT_APP_BASE_URL || '';

const socket = io('http://127.0.0.1:8080');

export default socket;