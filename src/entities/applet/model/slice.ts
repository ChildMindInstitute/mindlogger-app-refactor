import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import {
  EntityProgression,
  EntityProgressionCompleted,
  EntityProgressionEntityType,
  EntityProgressionInProgress,
  EntityProgressionInProgressActivity,
  EntityProgressionInProgressActivityFlow,
  EntityResponseTime,
} from '@app/abstract/lib/types/entityProgress';
import { cleanUpAction } from '@app/shared/lib/redux-state/actions';
import { isEntityExpired } from '@app/shared/lib/utils/survey/survey';

type InProgressEntity = {
  appletId: string;
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
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
  targetSubjectId: string | null;
  pipelineActivityOrder: number;
  availableTo?: Date | null;
};

export type StartActivityPayload = {
  appletId: string;
  entityId: string;
  eventId: string | null;
  targetSubjectId: string | null;
  availableUntil: Date | null;
};

export type UpsertEntityProgressionPayload = {
  appletId: string;
  entityType: EntityProgressionEntityType;
  entityId: string;
  eventId: string | null;
  targetSubjectId: string | null;
  endAt: Date;
};

type Consents = {
  shareToPublic: boolean;
  shareMediaToPublic: boolean;
};

export type AppletsConsents = Record<string, Consents | undefined>;

type InitialState = {
  entityProgressions?: EntityProgression[];
  entityResponseTimes?: EntityResponseTime[];
  consents?: AppletsConsents;
};

const initialState: InitialState = {
  entityProgressions: undefined,
  entityResponseTimes: undefined,
  consents: undefined,
};

type EntityProgressionFinderOptions = {
  appletId: string;
  entityType: EntityProgressionEntityType;
  entityId: string;
  eventId: string | null;
  targetSubjectId: string | null;
};

const entityProgressionFinder =
  (options: EntityProgressionFinderOptions) =>
  (progression: EntityProgression): boolean => {
    return (
      progression.appletId === options.appletId &&
      progression.entityType === options.entityType &&
      progression.entityId === options.entityId &&
      progression.eventId === options.eventId &&
      progression.targetSubjectId === options.targetSubjectId
    );
  };

const negate =
  <TArgs extends unknown[]>(predicate: (...args: TArgs) => boolean) =>
  (...args: TArgs): boolean =>
    !predicate(...args);

const slice = createSlice({
  name: 'applets',
  initialState,
  reducers: {
    startActivity: (state, action: PayloadAction<StartActivityPayload>) => {
      const updatedProgressions = (state.entityProgressions || []).filter(
        negate(
          entityProgressionFinder({
            appletId: action.payload.appletId,
            entityType: 'activity',
            entityId: action.payload.entityId,
            eventId: action.payload.eventId,
            targetSubjectId: action.payload.targetSubjectId,
          }),
        ),
      );

      const progression: EntityProgressionInProgressActivity = {
        status: 'in-progress',
        appletId: action.payload.appletId,
        entityType: 'activity',
        entityId: action.payload.entityId,
        eventId: action.payload.eventId,
        targetSubjectId: action.payload.targetSubjectId,
        startedAtTimestamp: new Date().getTime(),
        availableUntilTimestamp:
          action.payload.availableUntil?.getTime() || null,
      };
      updatedProgressions.push(progression);

      state.entityProgressions = updatedProgressions;
    },

    startFlow: (state, action: PayloadAction<InProgressFlow>) => {
      console.log(`!!! startFlow: ${JSON.stringify(action, null, 2)}`);
      const {
        appletId,
        activityId,
        activityName,
        activityDescription,
        activityImage,
        flowId,
        eventId,
        targetSubjectId,
        pipelineActivityOrder,
        totalActivities,
        availableTo,
      } = action.payload;

      const updatedProgressions = (state.entityProgressions || []).filter(
        negate(
          entityProgressionFinder({
            appletId: appletId,
            entityType: 'activityFlow',
            entityId: flowId,
            eventId: eventId,
            targetSubjectId: targetSubjectId,
          }),
        ),
      );

      const progression: EntityProgressionInProgressActivityFlow = {
        status: 'in-progress',
        appletId: appletId,
        entityType: 'activityFlow',
        entityId: flowId,
        eventId: eventId,
        targetSubjectId: targetSubjectId,
        startedAtTimestamp: new Date().getTime(),
        availableUntilTimestamp: availableTo?.getTime() || null,
        pipelineActivityOrder,
        totalActivitiesInPipeline: totalActivities,
        currentActivityId: activityId,
        currentActivityName: activityName,
        currentActivityDescription: activityDescription,
        currentActivityImage: activityImage,
        currentActivityStartAt: new Date().getTime(),
        executionGroupKey: uuidv4(),
      };
      updatedProgressions.push(progression);

      state.entityProgressions = updatedProgressions;
    },

    updateFlow: (state, action: PayloadAction<InProgressFlow>) => {
      const {
        appletId,
        activityId,
        activityName,
        activityDescription,
        activityImage,
        flowId,
        eventId,
        targetSubjectId,
        pipelineActivityOrder,
        totalActivities,
      } = action.payload;

      const existingProgression = (state.entityProgressions || []).find(
        entityProgressionFinder({
          appletId: appletId,
          entityType: 'activityFlow',
          entityId: flowId,
          eventId: eventId,
          targetSubjectId: targetSubjectId,
        }),
      ) as EntityProgressionInProgressActivityFlow | undefined;

      if (existingProgression) {
        existingProgression.currentActivityId = activityId;
        existingProgression.currentActivityName = activityName;
        existingProgression.currentActivityDescription = activityDescription;
        existingProgression.currentActivityImage = activityImage;
        existingProgression.pipelineActivityOrder = pipelineActivityOrder;
        existingProgression.currentActivityStartAt = new Date().getTime();
        existingProgression.totalActivitiesInPipeline = totalActivities;
      }
    },

    completeEntity: (state, action: PayloadAction<InProgressEntity>) => {
      const { appletId, entityId, eventId, targetSubjectId, endAt } =
        action.payload;

      const existingProgression = (state.entityProgressions || []).find(
        progression => {
          return (
            progression.appletId === appletId &&
            progression.entityId === entityId &&
            progression.eventId === eventId &&
            progression.targetSubjectId === targetSubjectId
          );
        },
      );

      if (!existingProgression) {
        return;
      }

      const { availableUntilTimestamp } =
        existingProgression as EntityProgressionInProgress;
      const isExpired = isEntityExpired(availableUntilTimestamp);

      const completedProgression =
        existingProgression as EntityProgressionCompleted;
      if (isExpired) {
        if (availableUntilTimestamp && availableUntilTimestamp > 0) {
          completedProgression.endedAtTimestamp = availableUntilTimestamp;
        } else {
          completedProgression.endedAtTimestamp = null;
        }
      } else {
        completedProgression.endedAtTimestamp = endAt;
      }

      if (!state.entityResponseTimes) {
        state.entityResponseTimes = [];
      }

      state.entityResponseTimes.push({
        entityId,
        eventId,
        targetSubjectId,
        responseTime: endAt,
      });
    },

    upsertEntityProgression: (
      state,
      action: PayloadAction<UpsertEntityProgressionPayload>,
    ) => {
      const existingProgression = (state.entityProgressions || []).find(
        entityProgressionFinder({
          appletId: action.payload.appletId,
          entityType: action.payload.entityType,
          entityId: action.payload.entityId,
          eventId: action.payload.eventId,
          targetSubjectId: action.payload.targetSubjectId,
        }),
      );

      if (existingProgression) {
        const existingCompletion =
          existingProgression as EntityProgressionCompleted;
        if (existingCompletion.status !== 'completed') {
          existingCompletion.status = 'completed';
        }

        if (
          !existingCompletion.endedAtTimestamp ||
          action.payload.endAt.getTime() > existingCompletion.endedAtTimestamp
        ) {
          existingCompletion.endedAtTimestamp = action.payload.endAt.getTime();
        }
      } else {
        const newCompletion: EntityProgressionCompleted = {
          status: 'completed',
          appletId: action.payload.appletId,
          entityType: action.payload.entityType,
          entityId: action.payload.entityId,
          eventId: action.payload.eventId,
          targetSubjectId: action.payload.targetSubjectId,
          endedAtTimestamp: action.payload.endAt.getTime(),
        };
        state.entityProgressions = state.entityProgressions ?? [];
        state.entityProgressions.push(newCompletion);
      }
    },

    shareConsentChanged: (
      state,
      action: PayloadAction<{ appletId: string; value: boolean }>,
    ) => {
      const { appletId, value } = action.payload;

      state.consents = state.consents ?? {};

      state.consents[appletId] = {
        shareToPublic: value,
        shareMediaToPublic: value,
      };
    },

    mediaConsentChanged: (
      state,
      action: PayloadAction<{ appletId: string; value: boolean }>,
    ) => {
      const { appletId, value } = action.payload;

      const appletConsents = state.consents?.[appletId];

      if (appletConsents) {
        appletConsents.shareMediaToPublic = value;
      }
    },
  },
  extraReducers: builder =>
    builder.addCase(cleanUpAction, () => {
      return initialState;
    }),
});

export const appletActions = slice.actions;

export const appletReducer = slice.reducer;
