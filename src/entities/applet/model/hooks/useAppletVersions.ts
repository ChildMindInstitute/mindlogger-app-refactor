import { useAppletsQuery } from '../../api/hooks/useAppletsQuery';
import { mapAppletDtoToAppletVersion } from '../mappers';

export function useAppletVersions() {
  const { data: appletVersions } = useAppletsQuery({
    select: response => response.data.result.map(mapAppletDtoToAppletVersion),
  });

  return appletVersions;
}
