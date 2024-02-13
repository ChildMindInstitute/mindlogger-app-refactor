import { v4 as uuidv4 } from 'uuid';

import {
  FlowProgress,
  Progress,
  ProgressPayload,
  StoreEntitiesProgress,
  StoreEventsProgress,
  StoreProgress,
  StoreProgressPayload,
} from '../types';

export const convertProgress = (storeProgress: StoreProgress): Progress => {
  const result: Progress = {};

  for (const appletId in storeProgress) {
    if (!result[appletId]) {
      result[appletId] = {};
    }
    const entitiesProgress: StoreEntitiesProgress = storeProgress[appletId];

    for (const entityId in entitiesProgress) {
      if (!result[appletId][entityId]) {
        result[appletId][entityId] = {};
      }

      const eventsProgress: StoreEventsProgress = entitiesProgress[entityId];

      for (const eventId in eventsProgress) {
        const storePayload: StoreProgressPayload = eventsProgress[eventId];

        const payload: ProgressPayload = {
          currentActivityId: (storePayload as FlowProgress).currentActivityId,
          endAt: !storePayload.endAt ? null : new Date(storePayload.endAt),
          startAt: new Date(storePayload.startAt),
          type: storePayload.type,
          currentActivityStartAt: null,
          executionGroupKey: uuidv4(),
          pipelineActivityOrder: (storePayload as FlowProgress)
            .pipelineActivityOrder,
        };
        result[appletId][entityId][eventId] = payload;
      }
    }
  }

  return result;
};
