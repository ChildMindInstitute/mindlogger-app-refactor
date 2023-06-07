import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ActivityPipelineType,
  StoreProgress,
  FlowProgress,
  StoreProgressPayload,
  CompletedEntities,
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
  completedEntities: CompletedEntities;
};

const initialState: InitialState = {
  inProgress: {},
  completedEntities: {},
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
      state.inProgress[appletId][activityId] =
        state.inProgress[appletId][activityId] ?? {};
      state.inProgress[appletId][activityId][eventId] = activityEvent;
    },

    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } =
        action.payload;

      const flowEvent: StoreProgressPayload = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activityId,
        startAt: new Date().getTime(),
        lastActivityStartAt: new Date().getTime(),
        endAt: null,
        pipelineActivityOrder,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][flowId] =
        state.inProgress[appletId][flowId] ?? {};

      state.inProgress[appletId][flowId][eventId] = flowEvent;
    },

    flowUpdated: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, flowId, eventId, pipelineActivityOrder } =
        action.payload;

      const event = state.inProgress[appletId][flowId][eventId] as FlowProgress;

      event.currentActivityId = activityId;
      event.pipelineActivityOrder = pipelineActivityOrder;
      event.lastActivityStartAt = new Date().getTime();
    },

    entityCompleted: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload;

      state.inProgress[appletId][entityId][eventId].endAt =
        new Date().getTime();

      const completedEntities = state.completedEntities ?? {};

      completedEntities[entityId] = new Date().getTime();
    },

    entityAnswersSent: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload;

      delete state.inProgress[appletId][entityId][eventId];
    },
  },
});

const { actions, reducer } = slice;

export { actions, reducer };
