import { AxiosResponse } from 'axios';

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
  notificationDescriptions: Array<any> | null;
  notificationInQueue: Array<any> | null;
  scheduledNotifications: Array<any> | null;
};

export type NotificationLogsResponse = SuccessfulEmptyResponse;

export type INotificationService = {
  sendNotificationLogs: (
    request: NotificationLogsRequest,
  ) => Promise<AxiosResponse<NotificationLogsResponse>>;
};
