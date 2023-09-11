import { useCallback, useEffect, useRef, useState } from 'react';

import { TCPSocketEmitter } from './TCPSocketEmitter';
import TCPSocketService from './TCPSocketService';

type Callbacks = {
  onError?: (error: Error) => void;
  onClosed?: () => void;
  onConnected?: () => void;
};

export function useTCPSocket(callbacks?: Callbacks) {
  const callbacksRef = useRef(callbacks);

  const [connected, setConnected] = useState(() => {
    const socket = TCPSocketService.getSocket();

    return !!socket && socket.readyState !== 'opening';
  });

  callbacksRef.current = callbacks;

  const sendMessage = useCallback(
    (message: string) => {
      if (!connected) {
        return;
      }

      TCPSocketService.sendMessage(`${message}$$$`);
    },
    [connected],
  );

  const connect = useCallback((host: string, port: number) => {
    return TCPSocketService.createConnection(host, port);
  }, []);

  const closeConnection = useCallback(() => {
    TCPSocketService.disconnect();
  }, []);

  const getSocketInfo = useCallback(() => {
    const socket = TCPSocketService.getSocket();

    if (!socket) {
      return null;
    }

    return {
      host: socket.remoteAddress,
      port: socket.remotePort,
    };
  }, []);

  useEffect(() => {
    const onConnected = () => {
      setConnected(true);
      callbacksRef.current?.onConnected?.();
    };

    const onClosed = () => {
      setConnected(false);
      callbacksRef.current?.onClosed?.();
    };

    const onError = (error: Error) => {
      setConnected(false);
      callbacksRef.current?.onError?.(error);
    };

    TCPSocketEmitter.on('tcp-socket-service:connected', onConnected);
    TCPSocketEmitter.on('tcp-socket-service:closed', onClosed);
    TCPSocketEmitter.on('tcp-socket-service:error', onError);

    return () => {
      TCPSocketEmitter.off('tcp-socket-service:connected', onConnected);
      TCPSocketEmitter.off('tcp-socket-service:closed', onClosed);
      TCPSocketEmitter.off('tcp-socket-service:error', onError);
    };
  }, []);

  return {
    connect,
    connected,

    getSocketInfo,
    sendMessage,
    closeConnection,
  };
}
