import EventEmitter from 'eventemitter3';

export type TCPSocketEvents = {
  'tcp-socket-service:connected': () => void;
  'tcp-socket-service:closed': () => void;
  'tcp-socket-service:error': (error: Error) => void;
};

export type ITCPSocketEmitter = EventEmitter<TCPSocketEvents>;
