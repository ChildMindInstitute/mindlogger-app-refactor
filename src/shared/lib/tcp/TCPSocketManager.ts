import TcpSocket from 'react-native-tcp-socket';

type Listeners = {
  onError?: (error: Error) => void;
  onClose?: () => void;
};

const getSocketKey = (host: string, port: number) => host + port;

class TCPSocketManager {
  private sockets: Record<string, TcpSocket.Socket>;

  constructor() {
    this.sockets = {};
  }

  attachListeners(socket: TcpSocket.Socket, listeners?: Listeners) {
    const onError = (error: Error) => {
      listeners?.onError?.(error);
    };

    const onClose = () => {
      listeners?.onClose?.();
    };

    socket.on('error', onError);
    socket.on('close', onClose);

    const unsubscribe = () => {
      socket.off('error', onError);
      socket.off('close', onClose);
    };

    return unsubscribe;
  }

  createOrJoin(host: string, port: number, onReady: () => void) {
    const key = getSocketKey(host, port);

    if (key in this.sockets) {
      onReady();
    } else {
      const socket = TcpSocket.createConnection({ host, port }, onReady);

      this.sockets[key] = socket;
    }

    return this.sockets[key];
  }

  destroy(host: string, port: number) {
    const key = getSocketKey(host, port);

    this.sockets[key].destroy();

    delete this.sockets[key];
  }
}

export default new TCPSocketManager();
