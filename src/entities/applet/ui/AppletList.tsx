import { FC } from 'react';

import { XStack, YStack } from '@tamagui/stacks';

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
  const {
    error,
    data: applets,
    isFetching,
    isSuccess,
  } = useAppletsQuery({
    select: response => response.data.result,
  });

  const hasError = !!error;

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  if (isSuccess && !applets?.length) {
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
            disabled={isFetching}
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
