import {
  LogAction,
  LogTrigger,
} from '@app/shared/api/services/INotificationService';

import { AppletNotificationDescribers } from '../types/notificationBuilder';

export type LogPayload = {
  trigger: LogTrigger;
  action: LogAction;
  notificationDescriptions?: Array<AppletNotificationDescribers> | null;
};

export type INotificationsLogger = {
  log: (payload: LogPayload) => Promise<void>;
};
