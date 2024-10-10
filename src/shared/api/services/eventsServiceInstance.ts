import { eventsService } from './eventsService';

let instance: ReturnType<typeof eventsService>;
export const getDefaultEventsService = () => {
  if (!instance) {
    instance = eventsService();
  }
  return instance;
};
