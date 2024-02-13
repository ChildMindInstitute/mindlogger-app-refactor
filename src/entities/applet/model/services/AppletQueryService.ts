import { QueryClient } from '@tanstack/react-query';

import { AppletDetailsResponse } from '@app/shared/api';
import { getAppletDetailsKey, getDataFromQuery } from '@app/shared/lib';

import { mapAppletDetailsFromDto } from '../mappers';

class AppletQueryStorage {
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

export default AppletQueryStorage;
