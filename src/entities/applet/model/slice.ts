import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import {
  ActivityPipelineType,
  StoreProgress,
  FlowProgress,
  StoreProgressPayload,
  CompletedEntities,
  IStoreProgressPayload,
  CompletedEventEntities,
} from '@app/abstract/lib';

type InProgressActivity = {
  appletId: string;
  activityId: string;
  eventId: string;
};

type InProgressEntity = {
  appletId: string;
  entityId: string;
  eventId: string;
};

type InProgressFlow = {
  appletId: string;
  flowId: string;
  activityId: string;
  eventId: string;
  pipelineActivityOrder: number;
};

type InitialState = {
  inProgress: StoreProgress;
  // todo - change to CompletedEventEntities when migrations infrastructure is ready
  completedEntities: CompletedEntities;
  completions: CompletedEventEntities;
};

const initialState: InitialState = {
  inProgress: {},
  completedEntities: {},
  completions: {},
};

const slice = createSlice({
  name: 'applets',
  initialState,
  reducers: {
    activityStarted: (state, action: PayloadAction<InProgressActivity>) => {
      const { appletId, activityId, eventId } = action.payload;

      const activityEvent: StoreProgressPayload = {
        type: ActivityPipelineType.Regular,
        startAt: new Date().getTime(),
        endAt: null,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][activityId] = state.inProgress[appletId][activityId] ?? {};
      state.inProgress[appletId][activityId][eventId] = activityEvent;
    },

    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } = action.payload;

      const flowEvent: StoreProgressPayload = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activityId,
        startAt: new Date().getTime(),
        currentActivityStartAt: new Date().getTime(),
        endAt: null,
        executionGroupKey: uuidv4(),
        pipelineActivityOrder,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][flowId] = state.inProgress[appletId][flowId] ?? {};

      state.inProgress[appletId][flowId][eventId] = flowEvent;
    },

    flowUpdated: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } = action.payload;

      const event = state.inProgress[appletId][flowId][eventId] as FlowProgress;

      event.currentActivityId = activityId;
      event.pipelineActivityOrder = pipelineActivityOrder;
      event.currentActivityStartAt = new Date().getTime();
    },

    entityCompleted: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload;

      state.inProgress[appletId][entityId][eventId].endAt = new Date().getTime();

      const completedEntities = state.completedEntities ?? {};

      const completions = state.completions ?? {};

      const now = new Date().getTime();

      completedEntities[entityId] = now;

      if (!completions[entityId]) {
        completions[entityId] = {};
      }

      const entityCompletions = completions[entityId];

      if (!entityCompletions[eventId]) {
        entityCompletions[eventId] = [];
      }
      entityCompletions[eventId].push(now);
    },

    entityAnswersSent: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload;

      delete state.inProgress[appletId][entityId][eventId];
    },

    completedEntityMissing: (state, action: PayloadAction<IStoreProgressPayload & InProgressEntity>) => {
      const { startAt, endAt, type, appletId, entityId, eventId } = action.payload;

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][entityId] = state.inProgress[appletId][entityId] ?? {};
      state.inProgress[appletId][entityId][eventId] = {
        type,
        startAt,
        endAt,
      } as StoreProgressPayload;
    },

    completedEntityUpdated: (state, action: PayloadAction<InProgressEntity & { endAt: number }>) => {
      const { endAt, appletId, entityId, eventId } = action.payload;

      state.inProgress[appletId][entityId][eventId].endAt = endAt;
    },
  },
});

const { actions, reducer } = slice;

export { actions, reducer };
