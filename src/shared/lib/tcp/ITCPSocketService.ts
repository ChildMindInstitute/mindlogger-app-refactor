import TcpSocket from 'react-native-tcp-socket';

export type ITCPSocketService = {
  createConnection: (host: string, port: number) => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  getSocket: () => TcpSocket.Socket | null;
};
