import { answerService } from './answerService';

let instance: ReturnType<typeof answerService>;
export const getDefaultAnswerService = () => {
  if (!instance) {
    instance = answerService();
  }
  return instance;
};
