import { QueryClient } from '@tanstack/react-query';

import { ActivityModel } from '@app/entities/activity';
import { AppletModel } from '@app/entities/applet';
import { ActivityResponse, AppletDetailsResponse } from '@app/shared/api';
import {
  createSecureStorage,
  getActivityDetailsKey,
  getAppletDetailsKey,
  getDataFromQuery,
} from '@app/shared/lib';

import { buildPipeline } from './pipelineBuilder';
import { ActivityState } from '../lib';

const storage = createSecureStorage('activity_progress-storage');

type ActivityRecordInitializerArgs = {
  appletId: string;
  queryClient: QueryClient;
};

type InitializeArgs = {
  activityId: string;
  eventId: string;
  order?: number;
};

type InitializeFlowArgs = {
  flowId: string;
  eventId: string;
};

export function ActivityRecordInitializer({
  appletId,
  queryClient,
}: ActivityRecordInitializerArgs) {
  const appletResponse = getDataFromQuery<AppletDetailsResponse>(
    getAppletDetailsKey(appletId),
    queryClient,
  )!;

  const applet = AppletModel.mapAppletDetailsFromDto(appletResponse.result);

  const initializeActivity = ({
    activityId,
    eventId,
    order = 0,
  }: InitializeArgs) => {
    const activityResponse = getDataFromQuery<ActivityResponse>(
      getActivityDetailsKey(activityId),
      queryClient,
    )!;

    const activity = ActivityModel.mapToActivity(activityResponse.result);

    const state: ActivityState = {
      step: 0,
      items: buildPipeline(activity),
      answers: {},
      appletVersion: applet.version,
      timers: {},
    };

    const key = `${appletId}-${activityId}-${eventId}-${order}`;

    if (!storage.contains(key)) {
      storage.set(key, JSON.stringify(state));
    }
  };

  const initializeFlow = ({ flowId, eventId }: InitializeFlowArgs) => {
    const flow = applet.activityFlows.find(o => o.id === flowId);

    if (!flow) {
      throw Error(
        '[ActivityRecordInitializer]: flow has not been found in the applet',
      );
    }

    flow.activityIds.forEach((activityId, order) => {
      initializeActivity({
        activityId,
        eventId,
        order,
      });
    });
  };

  return {
    initializeActivity,
    initializeFlow,
  };
}
