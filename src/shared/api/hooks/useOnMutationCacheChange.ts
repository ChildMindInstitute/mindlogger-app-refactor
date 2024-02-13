import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

const useOnMutationCacheChange = () => {
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.getMutationCache().subscribe((event) => {
      const key = event.mutation?.options.mutationKey?.[0];

      if (key === 'refresh') {
        setRefreshError(
          event.mutation!.state.status === 'error'
            ? event.mutation!.state.error
            : null,
        );
      }
    });
  }, [queryClient]);

  return refreshError;
};

export default useOnMutationCacheChange;
