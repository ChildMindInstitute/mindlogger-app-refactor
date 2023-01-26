import { FC } from 'react';

import { XStack, YStack } from '@tamagui/stacks';

import { useAppSelector } from '@app/shared/lib';
import { ActivityIndicator, BoxProps } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';
import { Applet } from '../lib';
import { selectors } from '../model';

const AppletList: FC<BoxProps> = props => {
  const { isLoading, error, data, isFetching } = useAppletsQuery();

  const refreshingByPullToRefresh = useAppSelector(
    selectors.selectRefreshingByPullToRefresh,
  );

  const hasError = !!error;

  const applets: Applet[] | undefined = data?.data?.applets?.map<Applet>(
    dto => ({
      ...dto,
    }),
  );

  if (isLoading || (isFetching && !refreshingByPullToRefresh)) {
    return <ActivityIndicator flex={1} size="large" />;
  }

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  return (
    <YStack {...props} space={18}>
      {applets?.map(x => (
        <AppletCard applet={x} key={x.id} disabled={isFetching} />
      ))}
    </YStack>
  );
};

export default AppletList;
