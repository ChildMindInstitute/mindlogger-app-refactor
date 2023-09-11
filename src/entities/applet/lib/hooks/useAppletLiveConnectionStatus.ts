import { useAppletDetailsQuery } from '../../api';
import { mapAppletDetailsFromDto } from '../../model';

export const useAppletLiveConnectionStatus = (appletId: string) => {
  const { data: todoIsLiveStreamingEnabled } = useAppletDetailsQuery(appletId, {
    select: response =>
      mapAppletDetailsFromDto(response.data.result).todoIsLiveStreamingEnabled,
  });

  return todoIsLiveStreamingEnabled;
};
