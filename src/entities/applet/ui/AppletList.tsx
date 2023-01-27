import { FC } from 'react';

import { XStack, YStack } from '@tamagui/stacks';

import { Box, BoxProps } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';
import { Applet } from '../lib';

const AppletList: FC<BoxProps> = props => {
  const { error, data, isFetching } = useAppletsQuery();

  const hasError = !!error;

  const applets: Applet[] | undefined = data?.data?.applets?.map<Applet>(
    dto => ({
      ...dto,
    }),
  );

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  return (
    <Box {...props}>
      <YStack space={18}>
        {applets?.map(x => (
          <AppletCard applet={x} key={x.id} disabled={isFetching} />
        ))}
      </YStack>
    </Box>
  );
};

export default AppletList;
