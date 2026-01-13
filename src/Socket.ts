import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export interface ServerToClientEvents {
  receiveMessage: (data: {
    _id: string;
    sender: {
      _id: string;
      email: string;
      name: string;
    };
    receiver: {
      _id: string;
      email: string;
      name: string;
    };
    content: string;
    isRead: boolean;
    createdAt: string;
  }) => void;
  messageSent: (data: any) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  sendMessage: (data: {
    sender: string;
    receiver: string;
    content: string;
  }) => void;
  join: (userId: string) => void;
}

export const socket: Socket<
  ServerToClientEvents,
  ClientToServerEvents
> = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
