import { useAppletDetailsQuery } from '../../api';
import { mapAppletDetailsFromDto } from '../../model';

export const useAppletStreamingDetails = (appletId: string) => {
  const { data: streamingData } = useAppletDetailsQuery(appletId, {
    select: response => {
      const details = mapAppletDetailsFromDto(response.data.result);

      return {
        streamEnabled: details.streamEnabled,
        streamIpAddress: details.streamIpAddress,
        streamPort: details.streamPort,
      };
    },
  });

  return streamingData;
};
