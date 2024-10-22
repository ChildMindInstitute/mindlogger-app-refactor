import { appletsService } from './appletsService';

let instance: ReturnType<typeof appletsService>;
export const getDefaultAppletsService = () => {
  if (!instance) {
    instance = appletsService();
  }
  return instance;
};
