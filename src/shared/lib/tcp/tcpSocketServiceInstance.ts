import { getDefaultTCPSocketEmitter } from './tcpSocketEmitterInstance';
import { TCPSocketService } from './TCPSocketService';

let instance: ReturnType<typeof TCPSocketService>;
export const getDefaultTCPSocketService = () => {
  if (!instance) {
    instance = TCPSocketService(getDefaultTCPSocketEmitter());
  }
  return instance;
};
