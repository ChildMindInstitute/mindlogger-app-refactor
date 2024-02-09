import { useAppletDetailsQuery } from '../../api';
import { mapAppletDetailsFromDto } from '../../model';

export const useAppletStreamingStatus = (appletId: string) => {
  const { data: streamEnabled } = useAppletDetailsQuery(appletId, {
    select: (response) => mapAppletDetailsFromDto(response.data.result).streamEnabled,
  });

  return streamEnabled || false;
};
