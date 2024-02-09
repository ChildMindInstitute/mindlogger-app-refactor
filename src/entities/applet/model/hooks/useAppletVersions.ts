import { useAppletsQuery } from '../../api';
import { mapAppletDtoToAppletVersion } from '../mappers';

function useAppletVersions() {
  const { data: appletVersions } = useAppletsQuery({
    select: (response) => response.data.result.map(mapAppletDtoToAppletVersion),
  });

  return appletVersions;
}

export default useAppletVersions;
