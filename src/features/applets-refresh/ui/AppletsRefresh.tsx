import { FC } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import { useRefresh } from '../model';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'>;

const AppletsRefresh: FC<Props> = props => {
  const { refresh, isRefreshing } = useRefresh(() => {});

  return (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={refresh}
      // Don't change. See https://github.com/facebook/react-native/issues/32144
      {...props}
    />
  );
};

export default AppletsRefresh;
