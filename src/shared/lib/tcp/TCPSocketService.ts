import TcpSocket from 'react-native-tcp-socket';

import { ITCPSocketEmitter } from './ITCPSocketEmitter';
import { ITCPSocketService } from './ITCPSocketService';

export function TCPSocketService(
  tcpSocketEmitter: ITCPSocketEmitter,
): ITCPSocketService {
  let socket: TcpSocket.Socket | null = null;
  const createConnection = (host: string, port: number) => {
    if (socket) {
      disconnect();
    }

    socket = TcpSocket.createConnection({ host, port }, () => {});

    socket.on('connect', () => {
      tcpSocketEmitter.emit('tcp-socket-service:connected');
    });

    socket.on('error', error => {
      socket?.removeAllListeners();
      disconnect();
      tcpSocketEmitter.emit('tcp-socket-service:error', error);
    });

    socket.on('close', () => {
      socket?.removeAllListeners();
      disconnect();
      tcpSocketEmitter.emit('tcp-socket-service:closed');
    });
  };

  const disconnect = () => {
    if (!socket || socket.destroyed) {
      return;
    }

    socket.destroy();
    socket = null;
  };

  const sendMessage = (message: string) => {
    if (!socket || socket.destroyed) {
      return;
    }

    socket.write(message);
  };

  const getSocket = () => socket;

  return {
    createConnection,
    disconnect,
    sendMessage,
    getSocket,
  };
}
