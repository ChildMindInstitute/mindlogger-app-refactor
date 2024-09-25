import { QueryClient } from '@tanstack/react-query';

import { AppletDetailsResponse } from '@app/shared/api/services/IAppletService';
import {
  getDataFromQuery,
  getAppletDetailsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';

import { mapAppletDetailsFromDto } from '../mappers';

export class AppletQueryStorage {
  constructor(private queryClient: QueryClient) {}

  getAppletDetails(appletId: string) {
    const data = getDataFromQuery<AppletDetailsResponse>(
      getAppletDetailsKey(appletId),
      this.queryClient,
    );

    if (!data) {
      throw Error(
        `[AppletQueryStorage]: No data found for applet details, appletId:${appletId}`,
      );
    }

    return mapAppletDetailsFromDto(data.result);
  }
}
