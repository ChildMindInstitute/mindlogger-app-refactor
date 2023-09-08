import { useCallback, useEffect, useRef, useState } from 'react';

import TcpSocket from 'react-native-tcp-socket';

import TCPSocketManager from './TCPSocketManager';

type Config = {
  host: string;
  port: number;
  enable?: boolean;
};

type Callbacks = {
  onError?: (error: Error) => void;
  onClose?: () => void;
  onOpen?: () => void;
};

export function useTCPSocket(
  { host, port, enable = true }: Config,
  callbacks?: Callbacks,
) {
  const socketRef = useRef<TcpSocket.Socket | null>(null);
  const callbacksRef = useRef(callbacks);

  callbacksRef.current = callbacks;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enable) {
      return;
    }

    setReady(false);

    const socket = TCPSocketManager.createOrJoin(host, port, () => {
      setReady(true);
      callbacksRef.current?.onOpen?.();
    });

    socketRef.current = socket;

    const unsubscribe = TCPSocketManager.attachListeners(
      socket,
      callbacksRef.current,
    );

    return unsubscribe;
  }, [enable, host, port]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!ready || !socketRef.current) {
        return;
      }

      socketRef.current.write(message);
    },
    [ready],
  );

  const closeConnection = useCallback(() => {
    if (!ready || !socketRef.current || socketRef.current.destroyed) {
      return;
    }

    TCPSocketManager.destroy(host, port);
    setReady(false);
    socketRef.current = null;
  }, [host, port, ready]);

  return {
    sendMessage,
    closeConnection,
  };
}
