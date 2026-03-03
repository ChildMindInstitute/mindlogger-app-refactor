import { configureStore } from '@reduxjs/toolkit';

import { EntityProgression } from '@app/abstract/lib/types/entityProgress';

import {
  appletActions,
  appletReducer,
  UpsertEntityProgressionPayload,
} from '../slice';

// Documents Redux slice behavior for upsertEntityProgression action.
// When isInProgress is undefined, the slice creates a completed progression if no existing record exists.
// This is correct behavior — the fix is in ProgressSyncService which now skips dispatching in-progress flows when feature flag is disabled.
describe('upsertEntityProgression action behavior', () => {
  const createStore = (entityProgressions: EntityProgression[] = []) =>
    configureStore({
      reducer: { applets: appletReducer },
      preloadedState: {
        applets: {
          entityProgressions,
          entityResponseTimes: [],
          consents: {},
        },
      },
    });

  const basePayload: UpsertEntityProgressionPayload = {
    appletId: 'applet-1',
    entityType: 'activityFlow',
    entityId: 'flow-1',
    eventId: 'event-1',
    targetSubjectId: null,
    endAt: 1706274000000,
    submitId: 'submit-1',
  };

  describe('When isInProgress is not provided', () => {
    it('creates a completed progression when no existing record exists', () => {
      const store = createStore([]);

      // When feature flag is disabled, ProgressSyncService dispatches without isInProgress
      store.dispatch(
        appletActions.upsertEntityProgression({
          ...basePayload,
          // isInProgress intentionally NOT set (undefined)
        }),
      );

      const progressions = store.getState().applets.entityProgressions!;
      expect(progressions).toHaveLength(1);
      expect(progressions[0].status).toBe('completed');
      expect(progressions[0].entityId).toBe('flow-1');
      expect(progressions[0].appletId).toBe('applet-1');
    });

    it('preserves an existing in-progress record without converting it to completed', () => {
      const store = createStore([
        {
          status: 'in-progress',
          appletId: 'applet-1',
          entityType: 'activityFlow',
          entityId: 'flow-1',
          eventId: 'event-1',
          targetSubjectId: null,
          startedAtTimestamp: 1706270000000,
          availableUntilTimestamp: null,
          submitId: 'local-submit',
          pipelineActivityOrder: 1,
          totalActivitiesInPipeline: 3,
          currentActivityId: 'activity-2',
          currentActivityName: 'Activity 2',
          currentActivityDescription: '',
          currentActivityImage: null,
          currentActivityStartAt: 1706270000000,
        },
      ]);

      // Dispatch without isInProgress while local in-progress exists — should NOT overwrite
      store.dispatch(
        appletActions.upsertEntityProgression({
          ...basePayload,
        }),
      );

      const progressions = store.getState().applets.entityProgressions!;
      expect(progressions).toHaveLength(1);
      // Remains in-progress without conversion
      expect(progressions[0].status).toBe('in-progress');
    });
  });

  describe('When isInProgress is set to true', () => {
    it('creates an in-progress progression when no existing record exists', () => {
      const store = createStore([]);

      store.dispatch(
        appletActions.upsertEntityProgression({
          ...basePayload,
          isInProgress: true,
          activityFlowOrder: 1,
          currentActivityId: 'activity-2',
          currentActivityName: 'Activity 2',
          currentActivityDescription: '',
          currentActivityImage: null,
          totalActivitiesInPipeline: 3,
          currentActivityStartAt: 1706368800000,
          availableUntilTimestamp: null,
        }),
      );

      const progressions = store.getState().applets.entityProgressions!;
      expect(progressions).toHaveLength(1);
      expect(progressions[0].status).toBe('in-progress');
      expect(progressions[0].entityType).toBe('activityFlow');
    });
  });

  describe('When isInProgress is set to false', () => {
    it('converts an existing in-progress progression to completed when server completion is newer', () => {
      const store = createStore([
        {
          status: 'in-progress',
          appletId: 'applet-1',
          entityType: 'activityFlow',
          entityId: 'flow-1',
          eventId: 'event-1',
          targetSubjectId: null,
          startedAtTimestamp: 1706270000000,
          availableUntilTimestamp: null,
          submitId: 'submit-1',
          pipelineActivityOrder: 0,
          totalActivitiesInPipeline: 2,
          currentActivityId: 'activity-1',
          currentActivityName: 'Activity 1',
          currentActivityDescription: '',
          currentActivityImage: null,
          currentActivityStartAt: 1706270000000,
        },
      ]);

      store.dispatch(
        appletActions.upsertEntityProgression({
          ...basePayload,
          isInProgress: false, // Server says completed
          endAt: 1706280000000, // After local start time
        }),
      );

      const progressions = store.getState().applets.entityProgressions!;
      expect(progressions).toHaveLength(1);
      expect(progressions[0].status).toBe('completed');
    });

    it('preserves in-progress status when server completion timestamp is older than local restart', () => {
      const store = createStore([
        {
          status: 'in-progress',
          appletId: 'applet-1',
          entityType: 'activityFlow',
          entityId: 'flow-1',
          eventId: 'event-1',
          targetSubjectId: null,
          startedAtTimestamp: 1706290000000, // Local started AFTER server endAt
          availableUntilTimestamp: null,
          submitId: 'local-submit-2',
          pipelineActivityOrder: 0,
          totalActivitiesInPipeline: 2,
          currentActivityId: 'activity-1',
          currentActivityName: 'Activity 1',
          currentActivityDescription: '',
          currentActivityImage: null,
          currentActivityStartAt: 1706290000000,
        },
      ]);

      store.dispatch(
        appletActions.upsertEntityProgression({
          ...basePayload,
          isInProgress: false,
          endAt: 1706280000000, // Server completed BEFORE local start
        }),
      );

      const progressions = store.getState().applets.entityProgressions!;
      expect(progressions).toHaveLength(1);
      // Stays in-progress — user restarted flow after this server completion
      expect(progressions[0].status).toBe('in-progress');
    });
  });
});
