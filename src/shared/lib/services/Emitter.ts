import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

type Events =
  | 'on-notification-refresh'
  | 'refresh-token-fail'
  | 'stepper:reset'
  | 'logout'
  | 'autocomplete';

const Emitter = {
  on: <TPayload>(event: Events, fn: (payload?: TPayload) => void) =>
    eventEmitter.on(event, fn),
  once: (event: Events, fn: () => void) => eventEmitter.once(event, fn),
  off: <TPayload>(event: Events, fn: (payload?: TPayload) => void) =>
    eventEmitter.off(event, fn),
  emit: <TPayload>(event: Events, payload?: TPayload) =>
    eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;
