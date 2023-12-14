import { callApiWithRetry } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulEmptyResponse } from '../types';

export const enum LogTrigger {
  AppMount = 'AppMount',
  FirstAppRun = 'FirstAppRun',
  RunBackgroundProcess = 'RunBackgroundProcess',
  EntityCompleted = 'ActivityOrFlowCompleted',
  PullToRefresh = 'PullToRefresh',
  GoToForeground = 'GoToForeground',
  LimitReachedNotification = 'LimitReachedNotification',
  ScheduleUpdated = 'ScheduleUpdated',
  AppletRemoved = 'AppletRemoved',
  AppletUpdated = 'AppletUpdated',
  EntitiesSyncedUp = 'EntitiesSyncedUp',
}

export const enum LogAction {
  ReSchedule = 'ReSchedule',
  ReStack = 'ReStack',
}

export type NotificationLogsRequest = {
  userId: string;
  deviceId: string;
  actionType: string;
  notificationDescriptions: string;
  notificationInQueue: string;
  scheduledNotifications: string;
};

export type NotificationLogsResponse = SuccessfulEmptyResponse;

function notificationService() {
  return {
    sendNotificationLogs(request: NotificationLogsRequest) {
      const apiCall = async () => {
        return httpService.post<NotificationLogsResponse>(
          '/logs/notification',
          request,
        );
      };
      return callApiWithRetry(apiCall);
    },
  };
}

export const NotificationService = notificationService();
