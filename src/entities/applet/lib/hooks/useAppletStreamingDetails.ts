import { useAppletDetailsQuery } from '../../api/hooks/useAppletDetailsQuery';
import { mapAppletDetailsFromDto } from '../../model/mappers';

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
