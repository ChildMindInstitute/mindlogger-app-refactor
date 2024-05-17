import { useCallback, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useToast } from '@shared/lib';

import { TCPSocketEmitter } from './TCPSocketEmitter';
import TCPSocketService from './TCPSocketService';

type Callbacks = {
  onError?: (error: Error) => void;
  onClosed?: () => void;
  onConnected?: () => void;
};

export function useTCPSocket(callbacks?: Callbacks) {
  const callbacksRef = useRef(callbacks);

  const { t } = useTranslation();
  const toast = useToast();

  const [connected, setConnected] = useState(() => {
    const socket = TCPSocketService.getSocket();

    return !!socket && socket.readyState !== 'opening';
  });

  const [connecting, setConnecting] = useState(false);

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

  const showDisconnectAlert = useCallback(() => {
    toast.show(t('live_connection:connection_closed'));
  }, [t, toast]);

  const connect = useCallback((host: string, port: number) => {
    setConnecting(true);

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
      setConnecting(false);
      callbacksRef.current?.onConnected?.();
    };

    const onClosed = () => {
      setConnected(false);
      setConnecting(false);
      if (!callbacksRef.current?.onClosed) {
        showDisconnectAlert();
      } else {
        callbacksRef.current.onClosed();
      }
    };

    const onError = (error: Error) => {
      setConnected(false);
      setConnecting(false);
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
  }, [showDisconnectAlert]);

  return {
    connect,
    connected,
    connecting,

    getSocketInfo,
    sendMessage,
    closeConnection,
  };
}
