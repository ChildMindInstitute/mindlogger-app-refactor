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
import { NavigationServiceScopes } from '@app/screens/lib/INavigationService';
import { getDefaultNavigationService } from '@app/screens/lib/navigationServiceInstance';
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
  endAt: Date | number; // Support both Date (legacy) and number (new) for backwards compatibility
  submitId: string;
  isInProgress?: boolean;
  activityFlowOrder?: number;
  currentActivityId?: string;
  currentActivityName?: string;
  currentActivityDescription?: string;
  currentActivityImage?: string | null;
  currentActivityStartAt?: number | null; // timestamp when current activity started
  totalActivitiesInPipeline?: number;
  availableUntilTimestamp?: number | null; // timestamp when entity expires
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
        submitId: uuidv4(),
      };
      updatedProgressions.push(progression);

      state.entityProgressions = updatedProgressions;
    },

    startFlow: (state, action: PayloadAction<InProgressFlow>) => {
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
        submitId: uuidv4(),
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
      completedProgression.status = 'completed';
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

      // Clear saved navigation state for active assessment when entity is completed
      getDefaultNavigationService().clearInitialNavigationState(
        NavigationServiceScopes.ActiveAssessment,
      );
    },

    upsertEntityProgression: (
      state,
      action: PayloadAction<UpsertEntityProgressionPayload>,
    ) => {
      const { payload } = action;

      const existingProgression = (state.entityProgressions || []).find(
        entityProgressionFinder({
          appletId: payload.appletId,
          entityType: payload.entityType,
          entityId: payload.entityId,
          eventId: payload.eventId,
          targetSubjectId: payload.targetSubjectId,
        }),
      );

      // Normalize endAt to timestamp (support both Date and number for backwards compatibility)
      const normalizeEndAt = (endAt: Date | number): number =>
        typeof endAt === 'number' ? endAt : endAt.getTime();

      // Handle in-progress flows from server (only when isInProgress is explicitly set)
      // This block only executes when feature flag is ON (caller sets isInProgress=true)
      if (payload.isInProgress && payload.entityType === 'activityFlow') {
        const serverPipelineActivityOrder = payload.activityFlowOrder ?? 0;
        const localPipelineActivityOrder =
          (existingProgression as EntityProgressionInProgressActivityFlow)
            ?.pipelineActivityOrder ?? 0;
        const serverSubmitId = payload.submitId;
        const localSubmitId = existingProgression?.submitId;
        const serverEndAt = normalizeEndAt(payload.endAt);
        const localEndAt =
          existingProgression?.status === 'completed'
            ? (existingProgression as EntityProgressionCompleted)
                .endedAtTimestamp ?? 0
            : 0;

        // Same submitId: keep furthest progress
        if (localSubmitId === serverSubmitId) {
          if (localPipelineActivityOrder >= serverPipelineActivityOrder) {
            return;
          }
        } else {
          // Different submitIds: local in-progress or completed takes precedence
          if (
            existingProgression &&
            existingProgression.status === 'in-progress' &&
            localPipelineActivityOrder >= serverPipelineActivityOrder
          ) {
            return;
          }
          if (
            existingProgression &&
            existingProgression.status === 'completed' &&
            localEndAt >= serverEndAt
          ) {
            return;
          }
        }

        const pipelineActivityOrder = serverPipelineActivityOrder;

        // Create or update in-progress flow with furthest progress
        const inProgressFlow: EntityProgressionInProgressActivityFlow = {
          status: 'in-progress',
          appletId: payload.appletId,
          entityType: 'activityFlow',
          entityId: payload.entityId,
          eventId: payload.eventId,
          targetSubjectId: payload.targetSubjectId,
          startedAtTimestamp:
            existingProgression?.startedAtTimestamp ?? serverEndAt,
          availableUntilTimestamp:
            payload.availableUntilTimestamp ??
            existingProgression?.availableUntilTimestamp ??
            null,
          submitId: payload.submitId,
          pipelineActivityOrder,
          totalActivitiesInPipeline: payload.totalActivitiesInPipeline || 1,
          currentActivityId: payload.currentActivityId || '',
          currentActivityName: payload.currentActivityName || '',
          currentActivityDescription: payload.currentActivityDescription || '',
          currentActivityImage: payload.currentActivityImage || null,
          currentActivityStartAt: payload.currentActivityStartAt ?? null,
        };

        // Remove existing and add updated one
        if (existingProgression) {
          state.entityProgressions = (state.entityProgressions || []).filter(
            p => p !== existingProgression,
          );
        }

        state.entityProgressions = state.entityProgressions || [];
        state.entityProgressions.push(inProgressFlow);

        return;
      }

      // Handle completed entities
      const endedAtTimestamp = normalizeEndAt(payload.endAt);

      if (existingProgression) {
        if (existingProgression.status === 'completed') {
          const existingCompletion =
            existingProgression as EntityProgressionCompleted;

          // Restart protection: Only apply when isInProgress was used (feature flag ON)
          // When isInProgress is undefined (normal behavior/flag OFF), skip this check for exact normal behavior
          if (payload.isInProgress !== undefined) {
            // Don't update endedAtTimestamp if it would be BEFORE the startedAtTimestamp
            // This can happen if user restarted a completed flow but we haven't fully synced yet
            if (
              existingCompletion.startedAtTimestamp &&
              endedAtTimestamp < existingCompletion.startedAtTimestamp
            ) {
              // Server's completion is older than local start - ignore it
              return;
            }
          }

          if (endedAtTimestamp > (existingCompletion.endedAtTimestamp ?? 0)) {
            existingCompletion.endedAtTimestamp = endedAtTimestamp;
          }
        } else if (existingProgression.status === 'in-progress') {
          // Convert in-progress to completed: Only apply new logic when isInProgress was used (feature flag ON)
          if (payload.isInProgress !== undefined) {
            // If existing is in-progress but server says completed:
            // Only convert to completed if the server's completion happened AFTER the local start
            // This prevents converting a restarted flow back to completed
            const localStartedAt = existingProgression.startedAtTimestamp;

            if (localStartedAt && endedAtTimestamp < localStartedAt) {
              // Server's completed record is OLDER than the local restart - ignore it
              return;
            }

            // Server completion is newer - update local state to mark as completed
            const completedProgression: EntityProgressionCompleted = {
              status: 'completed',
              appletId: payload.appletId,
              entityType: payload.entityType,
              entityId: payload.entityId,
              eventId: payload.eventId,
              targetSubjectId: payload.targetSubjectId,
              availableUntilTimestamp: null,
              startedAtTimestamp: existingProgression.startedAtTimestamp,
              endedAtTimestamp,
              submitId: payload.submitId,
            };

            // Remove in-progress and add completed
            state.entityProgressions = (state.entityProgressions || []).filter(
              p => p !== existingProgression,
            );
            state.entityProgressions.push(completedProgression);
          }
          // When isInProgress is undefined (normal behavior/flag OFF), don't convert - preserve normal behavior
        }
      } else {
        const newCompletion: EntityProgressionCompleted = {
          status: 'completed',
          appletId: payload.appletId,
          entityType: payload.entityType,
          entityId: payload.entityId,
          eventId: payload.eventId,
          targetSubjectId: payload.targetSubjectId,
          availableUntilTimestamp: null,
          startedAtTimestamp: 0,
          endedAtTimestamp,
          submitId: payload.submitId,
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
