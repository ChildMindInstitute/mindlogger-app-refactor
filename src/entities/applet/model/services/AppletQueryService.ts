import { QueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { AppletDetailsResponse } from '@app/shared/api';
import { getAppletDetailsKey } from '@app/shared/lib';

import { mapAppletDetailsFromDto } from '../mappers';

class AppletQueryStorage {
  constructor(private queryClient: QueryClient) {}

  getAppletDetails(appletId: string) {
    const response = this.queryClient.getQueryData(
      getAppletDetailsKey(appletId),
    ) as AxiosResponse<AppletDetailsResponse, any>;

    return mapAppletDetailsFromDto(response.data.result);
  }
}

export default AppletQueryStorage;
