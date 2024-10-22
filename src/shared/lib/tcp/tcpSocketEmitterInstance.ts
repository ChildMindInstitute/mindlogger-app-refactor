import EventEmitter from 'eventemitter3';

import { TCPSocketEvents } from './ITCPSocketEmitter';

let instance: EventEmitter<TCPSocketEvents>;
export const getDefaultTCPSocketEmitter = () => {
  if (!instance) {
    instance = new EventEmitter<TCPSocketEvents>();
  }
  return instance;
};
