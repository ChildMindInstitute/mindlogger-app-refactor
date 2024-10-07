import { callApiWithRetry } from '@app/shared/lib/utils/networkHelpers';

import { httpService } from './httpService';
import {
  INotificationService,
  NotificationLogsRequest,
  NotificationLogsResponse,
} from './INotificationService';

export function notificationService(): INotificationService {
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
