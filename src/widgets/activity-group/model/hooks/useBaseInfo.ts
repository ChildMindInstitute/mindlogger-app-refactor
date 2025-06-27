import { useBaseQuery } from '@app/shared/api/hooks/useBaseQuery';
import { getDefaultAppletsService } from '@app/shared/api/services/appletsServiceInstance';
import { getResponseTypesMap } from '@app/shared/lib/utils/responseTypes';
import { getAppletBaseInfoKey } from '@shared/lib/utils/reactQueryHelpers.ts';

import { useTimer } from './useTimer';

export const useBaseInfo = (appletId: string) => {
  useTimer();

  return useBaseQuery(
    getAppletBaseInfoKey(appletId),
    () => getDefaultAppletsService().getAppletBaseInfo({ appletId }),
    {
      select: ({ data }) => ({
        ...data.result,
        responseTypes: getResponseTypesMap(data),
      }),
    },
  );
};
