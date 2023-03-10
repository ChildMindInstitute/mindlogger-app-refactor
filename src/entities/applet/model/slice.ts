import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ActivityPipelineType,
  EntitiesInProgress,
  ProgressPayload,
} from '../lib';

type InProgressActivity = {
  appletId: string;
  activityId: string;
  eventId: string;
};

type InProgressFlow = {
  appletId: string;
  activityFlowId: string;
  activityId: string;
  eventId: string;
};

type InitialState = {
  inProgress: EntitiesInProgress;
};

const initialState: InitialState = {
  inProgress: {},
};

const slice = createSlice({
  name: 'applets',
  initialState,
  reducers: {
    activityStarted: (state, action: PayloadAction<InProgressActivity>) => {
      const { appletId, activityId, eventId } = action.payload;

      const activityEvent: ProgressPayload = {
        type: ActivityPipelineType.Regular,
        startAt: new Date(),
        endAt: null,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][activityId] =
        state.inProgress[appletId][activityId] ?? {};
      state.inProgress[appletId][activityId][eventId] = activityEvent;
    },
    activityCompleted: (state, action: PayloadAction<InProgressActivity>) => {
      const { appletId, activityId, eventId } = action.payload;

      state.inProgress[appletId][activityId][eventId].endAt = new Date();
    },
    activityAnswersSent: (state, action: PayloadAction<InProgressActivity>) => {
      const { appletId, activityId, eventId } = action.payload;

      delete state.inProgress[appletId][activityId][eventId];
    },

    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityId, activityFlowId, eventId } = action.payload;

      const flowEvent: ProgressPayload = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activityId,
        startAt: new Date(),
        endAt: null,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][activityFlowId] =
        state.inProgress[appletId][activityFlowId] ?? {};

      state.inProgress[appletId][activityId][eventId] = flowEvent;
    },
    flowCompleted: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityFlowId, eventId } = action.payload;

      state.inProgress[appletId][activityFlowId][eventId].endAt = new Date();
    },
    flowAnswersSent: (state, action: PayloadAction<InProgressFlow>) => {
      const { appletId, activityFlowId, eventId } = action.payload;

      delete state.inProgress[appletId][activityFlowId][eventId];
    },
  },
});

const { actions, reducer } = slice;

export { actions, reducer };
