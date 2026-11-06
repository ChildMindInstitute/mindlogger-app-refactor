import { ConsoleLogger } from './Logger';

let instance: ConsoleLogger;
export const getDefaultLogger = () => {
  if (!instance) {
    instance = new ConsoleLogger();
  }
  return instance;
};
