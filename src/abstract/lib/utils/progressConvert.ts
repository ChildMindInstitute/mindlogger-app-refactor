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

  for (let appletId in storeProgress) {
    if (!result[appletId]) {
      result[appletId] = {};
    }
    const entitiesProgress: StoreEntitiesProgress = storeProgress[appletId];

    for (let entityId in entitiesProgress) {
      if (!result[appletId][entityId]) {
        result[appletId][entityId] = {};
      }

      const eventsProgress: StoreEventsProgress = entitiesProgress[entityId];

      for (let eventId in eventsProgress) {
        const storePayload: StoreProgressPayload = eventsProgress[eventId];

        const flowProgress = storePayload as FlowProgress;

        const payload: ProgressPayload = {
          currentActivityId: flowProgress.currentActivityId,
          currentActivityName: flowProgress.currentActivityName,
          currentActivityDescription: flowProgress.currentActivityDescription,
          currentActivityImage: flowProgress.currentActivityImage,
          endAt: !storePayload.endAt ? null : new Date(storePayload.endAt),
          startAt: new Date(storePayload.startAt),
          availableTo: !storePayload.availableTo
            ? null
            : new Date(storePayload.availableTo),
          type: storePayload.type,
          currentActivityStartAt: null,
          executionGroupKey: uuidv4(),
          pipelineActivityOrder: flowProgress.pipelineActivityOrder,
          totalActivitiesInPipeline: flowProgress.totalActivitiesInPipeline,
        };
        result[appletId][entityId][eventId] = payload;
      }
    }
  }

  return result;
};
