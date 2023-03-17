import { useAppletThemesQuery } from '../../api';
import { mapThemeDTOs } from '../mappers';

function useAppletThemes() {
  const { data: theme } = useAppletThemesQuery({
    select: o => mapThemeDTOs(o.data.result),
  });

  return theme ?? {};
}

export default useAppletThemes;
