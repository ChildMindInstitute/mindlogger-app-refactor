import { QueryClient } from '@tanstack/react-query';

import { ActivityDetails } from '@app/entities/activity/lib/types/activity';
import { mapToActivity } from '@app/entities/activity/model/mappers';
import { mapAppletDetailsFromDto } from '@app/entities/applet/model/mappers';
import { ActivityResponse } from '@app/shared/api/services/IActivityService';
import { AppletDetailsResponse } from '@app/shared/api/services/IAppletService';
import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';
import {
  getDataFromQuery,
  getAppletDetailsKey,
  getActivityDetailsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';
import { getActivityRecordKey } from '@app/widgets/survey/lib/storageHelpers';

import { buildPipeline } from './pipelineBuilder';
import { ActivityState } from '../lib/hooks/useActivityStorageRecord';
import { ActivityItemType } from '../lib/types/payload';

type ActivityRecordInitializerArgs = {
  appletId: string;
  queryClient: QueryClient;
};

type InitializeArgs = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  order?: number;
};

type InitializeFlowArgs = {
  eventId: string;
  targetSubjectId: string | null;
  flowActivityIds: string[];
};

export type InitializeHiddenItem = {
  isHidden: boolean;
  itemId: string;
  type: ActivityItemType;
};

export function ActivityRecordInitializer({
  appletId,
  queryClient,
}: ActivityRecordInitializerArgs) {
  const appletResponse = getDataFromQuery<AppletDetailsResponse>(
    getAppletDetailsKey(appletId),
    queryClient,
  )!;

  const applet = mapAppletDetailsFromDto(appletResponse.result);

  const initializeActivity = ({
    activityId,
    eventId,
    targetSubjectId,
    order = 0,
  }: InitializeArgs) => {
    const key = getActivityRecordKey(
      appletId,
      activityId,
      eventId,
      targetSubjectId,
      order,
    );

    const storageRecordExist = getDefaultStorageInstanceManager()
      .getActivityProgressStorage()
      .contains(key);

    if (storageRecordExist) {
      moveAbTrailsStepToTutorial(key);
      return;
    }

    const activityResponse = getDataFromQuery<ActivityResponse>(
      getActivityDetailsKey(activityId),
      queryClient,
    )!;

    const activity: ActivityDetails = mapToActivity(activityResponse.result);

    const state: ActivityState = {
      step: 0,
      items: buildPipeline(activity),
      scoreSettings: activity.scoreSettings,
      hasSummary: activity.hasSummary,
      answers: {},
      appletVersion: applet.version,
      timers: {},
      actions: [],
      context: {
        originalItems: activity.items.map<InitializeHiddenItem>(item => ({
          itemId: item.id,
          isHidden: item.isHidden,
          type: item.inputType as ActivityItemType,
        })),
      },
    };

    getDefaultStorageInstanceManager()
      .getActivityProgressStorage()
      .set(key, JSON.stringify(state));
  };

  const moveAbTrailsStepToTutorial = (key: string) => {
    const state = JSON.parse(
      getDefaultStorageInstanceManager()
        .getActivityProgressStorage()
        .getString(key)!,
    ) as ActivityState;

    if (state.items[state.step].type === 'AbTest') {
      state.step -= 1;
      getDefaultStorageInstanceManager()
        .getActivityProgressStorage()
        .set(key, JSON.stringify(state));
    }
  };

  const initializeFlowActivities = ({
    eventId,
    targetSubjectId,
    flowActivityIds,
  }: InitializeFlowArgs) => {
    flowActivityIds.forEach((activityId, order) => {
      initializeActivity({
        activityId,
        eventId,
        targetSubjectId,
        order,
      });
    });
  };

  return {
    initializeActivity,
    initializeFlowActivities,
  };
}
