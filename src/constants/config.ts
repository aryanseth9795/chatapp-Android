export const SERVER_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || "http://192.168.1.100:3000";

export const API_URL = `${SERVER_URL}/api/v1`;

export const SOCKET_CONFIG = {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
};

export default {
  SERVER_URL,
  API_URL,
  SOCKET_CONFIG,
};
