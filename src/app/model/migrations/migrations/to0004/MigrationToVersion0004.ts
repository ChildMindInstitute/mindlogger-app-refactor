import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  EntityProgression,
  EntityResponseTime,
} from '@app/abstract/lib/types/entityProgress';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import {
  FlowProgress,
  RootStateFrom,
  RootStateTo,
} from './MigrationReduxTypes0004';
import { IMigration, MigrationInput, MigrationOutput } from '../../types';

export class MigrationToVersion0004
  implements IMigration<RootStateFrom, RootStateTo>
{
  constructor() {}

  migrate(input: MigrationInput<RootStateFrom>): MigrationOutput<RootStateTo> {
    const existingEntityProgressions = (input.reduxState.applets
      .entityProgressions || []) as EntityProgression[];
    const existingEntityResponseTimes = (input.reduxState.applets
      .entityResponseTimes || []) as EntityResponseTime[];

    const entityProgressions: EntityProgression[] = [
      ...existingEntityProgressions,
    ];

    const entityResponseTimes: EntityResponseTime[] = [
      ...existingEntityResponseTimes,
    ];

    const previousInProgressApplets = input.reduxState.applets.inProgress || {};
    const previousInProgressAppletIds = Object.keys(previousInProgressApplets);

    for (const previousInProgressAppletId of previousInProgressAppletIds) {
      const previousInProgressApplet =
        previousInProgressApplets[previousInProgressAppletId];
      const previousInProgressAppletEntityIds = Object.keys(
        previousInProgressApplet,
      );

      for (const previousInProgressAppletEntityId of previousInProgressAppletEntityIds) {
        const previousInProgressAppletEntity =
          previousInProgressApplet[previousInProgressAppletEntityId];
        const previousInProgressAppletEntityEventIds = Object.keys(
          previousInProgressAppletEntity,
        );

        for (const previousInProgressAppletEntityEventId of previousInProgressAppletEntityEventIds) {
          const previousInProgressAppletEntityEventPayload =
            previousInProgressAppletEntity[
              previousInProgressAppletEntityEventId
            ];

          const entityType =
            previousInProgressAppletEntityEventPayload.type ===
            ActivityPipelineType.Flow
              ? 'activityFlow'
              : 'activity';

          const migratedEntityProgression = entityProgressions.find(record => {
            return (
              record.appletId === previousInProgressAppletId &&
              record.entityType === entityType &&
              record.entityId === previousInProgressAppletEntityId &&
              record.eventId === previousInProgressAppletEntityEventId &&
              record.targetSubjectId === null
            );
          });
          if (!migratedEntityProgression) {
            const isInProgress =
              !previousInProgressAppletEntityEventPayload.endAt ||
              previousInProgressAppletEntityEventPayload.endAt <= 0;

            const newEntityProgression = {
              status: isInProgress ? 'in-progress' : 'completed',
              appletId: previousInProgressAppletId,
              entityType,
              entityId: previousInProgressAppletEntityId,
              eventId: previousInProgressAppletEntityEventId,
              targetSubjectId: null,
              startedAtTimestamp:
                previousInProgressAppletEntityEventPayload.startAt,
              availableUntilTimestamp:
                previousInProgressAppletEntityEventPayload.availableTo,
              endedAtTimestamp:
                previousInProgressAppletEntityEventPayload.endAt,
            } as Record<string, unknown>;

            if (entityType === 'activityFlow') {
              const previousFlowPayload =
                previousInProgressAppletEntityEventPayload as FlowProgress;

              newEntityProgression.pipelineActivityOrder =
                previousFlowPayload.pipelineActivityOrder;
              newEntityProgression.totalActivitiesInPipeline =
                previousFlowPayload.totalActivitiesInPipeline;
              newEntityProgression.currentActivityId =
                previousFlowPayload.currentActivityId;
              newEntityProgression.currentActivityName =
                previousFlowPayload.currentActivityName;
              newEntityProgression.currentActivityDescription =
                previousFlowPayload.currentActivityDescription;
              newEntityProgression.currentActivityImage =
                previousFlowPayload.currentActivityImage;
              newEntityProgression.currentActivityStartAt =
                previousFlowPayload.currentActivityStartAt;
              newEntityProgression.executionGroupKey =
                previousFlowPayload.executionGroupKey;
            }

            entityProgressions.push(newEntityProgression as EntityProgression);
            getDefaultLogger().info(
              `[MigrationToVersion0004.migrate]: migrated entity progression record ${JSON.stringify(newEntityProgression)}`,
            );
          }
        }
      }
    }

    // We can ignore `completedEntities` because it contains only the latest
    // response time value, and `completions` contains all the values.
    // So we can just use `completions` to populate the `entityResponseTimes`.
    const previousCompletions = input.reduxState.applets.completions || {};
    const previousCompletionsEntityIds = Object.keys(previousCompletions);

    for (const previousCompletionsEntityId of previousCompletionsEntityIds) {
      const previousCompletion =
        previousCompletions[previousCompletionsEntityId];
      const previousCompletionEventIds = Object.keys(previousCompletion);

      for (const previousCompletionEventId of previousCompletionEventIds) {
        const previousCompletionResponseTimes =
          previousCompletion[previousCompletionEventId];

        for (const previousCompletionResponseTime of previousCompletionResponseTimes) {
          const migratedEntityResponseTime =
            entityResponseTimes.find(record => {
              return (
                record.entityId === previousCompletionsEntityId &&
                record.eventId === previousCompletionEventId &&
                record.targetSubjectId === null
              );
            }) || null;
          if (!migratedEntityResponseTime) {
            const newEntityResponseTime: EntityResponseTime = {
              entityId: previousCompletionsEntityId,
              eventId: previousCompletionEventId,
              targetSubjectId: null,
              responseTime: previousCompletionResponseTime,
            };

            entityResponseTimes.push(newEntityResponseTime);
            getDefaultLogger().info(
              `[MigrationToVersion0004.migrate]: migrated entity response time record ${JSON.stringify(newEntityResponseTime)}`,
            );
          }
        }
      }
    }

    return {
      reduxState: {
        ...(input?.reduxState || {}),
        applets: {
          ...(input?.reduxState?.applets || {}),
          entityProgressions,
          entityResponseTimes,
        },
      },
    };
  }
}
