import TcpSocket from 'react-native-tcp-socket';

import { TCPSocketEmitter } from './TCPSocketEmitter';

function TCPSocketService() {
  let socket: TcpSocket.Socket | null = null;

  const createConnection = (host: string, port: number) => {
    if (socket) {
      disconnect();
    }

    socket = TcpSocket.createConnection({ host, port }, () => {});

    socket.on('connect', () => {
      TCPSocketEmitter.emit('tcp-socket-service:connected');
    });

    socket.on('error', error => {
      socket?.removeAllListeners();
      disconnect();
      TCPSocketEmitter.emit('tcp-socket-service:error', error);
    });

    socket.on('close', () => {
      TCPSocketEmitter.emit('tcp-socket-service:closed');
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

export default TCPSocketService();
