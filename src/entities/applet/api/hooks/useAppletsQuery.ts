import { QueryOptions, useBaseQuery } from '@app/shared/api';
import appletsService from '@app/shared/api/services/appletsService';

type Options = QueryOptions<typeof appletsService.getApplets>;

export const useAppletsQuery = (options?: Options) => {
  return useBaseQuery(['applets'], appletsService.getApplets, {
    ...options,
    // todo - add select/map here
  });
};
