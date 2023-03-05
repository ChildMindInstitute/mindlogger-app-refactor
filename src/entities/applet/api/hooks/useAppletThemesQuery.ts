import { QueryOptions, ReturnAwaited, useBaseQuery } from '@app/shared/api';
import { ThemeService } from '@app/shared/api';

type FetchFn = typeof ThemeService.getAll;
type Options<TData> = QueryOptions<FetchFn, TData>;

export const useAppletThemesQuery = <TData = ReturnAwaited<FetchFn>>(
  options?: Options<TData>,
) => {
  return useBaseQuery(['themes'], ThemeService.getAll, options);
};
