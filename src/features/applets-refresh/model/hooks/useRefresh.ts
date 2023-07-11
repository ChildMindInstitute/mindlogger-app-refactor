import { useState } from 'react';

import useRefreshMutation from './useRefreshMutation';

function useRefresh(onSuccess: () => void) {
  const { mutateAsync: refresh } = useRefreshMutation(onSuccess);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    refresh().then(() => setIsRefreshing(false));
    setIsRefreshing(true);
  };

  return {
    refresh: onRefresh,
    isRefreshing,
  };
}

export default useRefresh;
