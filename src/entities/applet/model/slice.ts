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
import { cleanUpAction, isEntityExpired } from '@app/shared/lib';

type InProgressActivity = {
  appletId: string;
  activityId: string;
  eventId: string;
  availableTo?: Date | null;
};

type InProgressEntity = {
  appletId: string;
  entityId: string;
  eventId: string;
};

type CompletionFixation = {
  endAt: number;
};

type InProgressFlow = {
  appletId: string;
  flowId: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  activityImage: string | null;
  totalActivities: number;
  eventId: string;
  pipelineActivityOrder: number;
  availableTo?: Date | null;
};

type Consents = {
  shareToPublic: boolean;
  shareMediaToPublic: boolean;
};

export type AppletsConsents = Record<string, Consents | undefined>;

type InitialState = {
  inProgress: StoreProgress;
  // todo - change to CompletedEventEntities when migrations infrastructure is ready
  completedEntities: CompletedEntities;
  completions: CompletedEventEntities;
  consents: AppletsConsents;
};

const initialState: InitialState = {
  inProgress: {},
  completedEntities: {},
  completions: {},
  consents: {},
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
        availableTo: action.payload.availableTo?.getTime() ?? null,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][activityId] =
        state.inProgress[appletId][activityId] ?? {};
      state.inProgress[appletId][activityId][eventId] = activityEvent;
    },

    flowStarted: (state, action: PayloadAction<InProgressFlow>) => {
      const {
        appletId,
        activityId,
        activityName,
        activityDescription,
        activityImage,
        flowId,
        eventId,
        pipelineActivityOrder,
        totalActivities,
        availableTo,
      } = action.payload;

      const flowEvent: StoreProgressPayload = {
        type: ActivityPipelineType.Flow,
        currentActivityId: activityId,
        currentActivityName: activityName,
        currentActivityDescription: activityDescription,
        currentActivityImage: activityImage,
        startAt: new Date().getTime(),
        currentActivityStartAt: new Date().getTime(),
        endAt: null,
        availableTo: availableTo?.getTime() ?? null,
        executionGroupKey: uuidv4(),
        pipelineActivityOrder,
        totalActivitiesInPipeline: totalActivities,
      };

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][flowId] =
        state.inProgress[appletId][flowId] ?? {};

      state.inProgress[appletId][flowId][eventId] = flowEvent;
    },

    flowUpdated: (state, action: PayloadAction<InProgressFlow>) => {
      const {
        appletId,
        activityId,
        activityName,
        activityDescription,
        activityImage,
        flowId,
        eventId,
        pipelineActivityOrder,
        totalActivities,
      } = action.payload;

      const event = state.inProgress[appletId][flowId][eventId] as FlowProgress;

      event.currentActivityId = activityId;
      event.currentActivityName = activityName;
      event.currentActivityDescription = activityDescription;
      event.currentActivityImage = activityImage;
      event.pipelineActivityOrder = pipelineActivityOrder;
      event.currentActivityStartAt = new Date().getTime();
      event.totalActivitiesInPipeline = totalActivities;
    },

    entityCompleted: (
      state,
      action: PayloadAction<InProgressEntity & CompletionFixation>,
    ) => {
      const { appletId, entityId, eventId, endAt } = action.payload;

      const { availableTo } = state.inProgress[appletId][entityId][eventId];

      const isExpired = isEntityExpired(availableTo);

      state.inProgress[appletId][entityId][eventId].endAt = isExpired
        ? availableTo
        : endAt;

      const completedEntities = state.completedEntities ?? {};

      const completions = state.completions ?? {};

      completedEntities[entityId] = endAt;

      if (!completions[entityId]) {
        completions[entityId] = {};
      }

      const entityCompletions = completions[entityId];

      if (!entityCompletions[eventId]) {
        entityCompletions[eventId] = [];
      }
      entityCompletions[eventId].push(endAt);
    },

    entityAnswersSent: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId } = action.payload;

      delete state.inProgress[appletId][entityId][eventId];
    },

    completedEntityMissing: (
      state,
      action: PayloadAction<IStoreProgressPayload & InProgressEntity>,
    ) => {
      const { startAt, endAt, type, appletId, entityId, eventId } =
        action.payload;

      state.inProgress[appletId] = state.inProgress[appletId] ?? {};
      state.inProgress[appletId][entityId] =
        state.inProgress[appletId][entityId] ?? {};
      state.inProgress[appletId][entityId][eventId] = {
        type,
        startAt,
        endAt,
      } as StoreProgressPayload;
    },

    completedEntityUpdated: (
      state,
      action: PayloadAction<InProgressEntity & { endAt: number }>,
    ) => {
      const { endAt, appletId, entityId, eventId } = action.payload;

      state.inProgress[appletId][entityId][eventId].endAt = endAt;
    },

    applyDataSharingSettings: (
      state,
      action: PayloadAction<{ appletId: string }>,
    ) => {
      const { appletId } = action.payload;

      state.consents[appletId] = {
        shareToPublic: true,
        shareMediaToPublic: true,
      };
    },

    removeDataSharingSettings: (
      state,
      action: PayloadAction<{ appletId: string }>,
    ) => {
      const { appletId } = action.payload;

      delete state.consents[appletId];
    },

    toggleShareConsent: (
      state,
      action: PayloadAction<{ appletId: string }>,
    ) => {
      const { appletId } = action.payload;

      const appletConsents = state.consents[appletId];

      if (!appletConsents) {
        return;
      }

      const currentValue = appletConsents.shareToPublic;

      appletConsents.shareToPublic = !currentValue;
      appletConsents.shareMediaToPublic = !currentValue;
    },

    toggleMediaConsent: (
      state,
      action: PayloadAction<{ appletId: string }>,
    ) => {
      const { appletId } = action.payload;

      const appletConsents = state.consents[appletId];

      if (!appletConsents) {
        return;
      }

      const currentValue = appletConsents.shareMediaToPublic;

      appletConsents.shareMediaToPublic = !currentValue;
    },
  },
  extraReducers: builder =>
    builder.addCase(cleanUpAction, () => {
      return initialState;
    }),
});

const { actions, reducer } = slice;

export { actions, reducer };
