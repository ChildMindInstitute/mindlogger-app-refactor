import { FC, useEffect } from 'react';

import { XStack, YStack } from '@tamagui/stacks';
import { useIsMutating } from '@tanstack/react-query';

import { useOnMutationCacheChange } from '@app/shared/api';
import { useCacheHasData } from '@app/shared/lib';
import { useRefreshMutation } from '@app/shared/lib';
import { Box, BoxProps, NoListItemsYet } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';

type SelectedApplet = {
  id: string;
  displayName: string;
};

type Props = {
  onAppletPress: (applet: SelectedApplet) => void;
} & BoxProps;

const AppletList: FC<Props> = ({ onAppletPress, ...styledProps }) => {
  const { error: getAppletsError, data: applets } = useAppletsQuery({
    select: response => response.data.result,
  });

  const { mutate: refresh } = useRefreshMutation();

  const { check: checkIfCacheHasData } = useCacheHasData();

  const isRefreshing = useIsMutating(['refresh']);

  const refreshError = useOnMutationCacheChange();

  const hasError = !!refreshError || !!getAppletsError;

  useEffect(() => {
    const cacheHasData = checkIfCacheHasData();

    if (!cacheHasData) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  if (!isRefreshing && !applets?.length) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <NoListItemsYet translationKey="applet_list_component:no_applets_yet" />
      </XStack>
    );
  }

  return (
    <Box {...styledProps}>
      <YStack space={18}>
        {applets?.map(x => (
          <AppletCard
            applet={x}
            key={x.id}
            disabled={!!isRefreshing}
            onPress={() =>
              onAppletPress({ id: x.id, displayName: x.displayName })
            }
          />
        ))}
      </YStack>
    </Box>
  );
};

export default AppletList;
