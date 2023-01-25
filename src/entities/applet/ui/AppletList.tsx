import { FC } from 'react';

import { XStack, YStack } from '@tamagui/stacks';

import { ActivityIndicator, Box, BoxProps } from '@app/shared/ui';
import { LoadListError } from '@app/shared/ui';

import AppletCard from './AppletCard';
import { useAppletsQuery } from '../api';
import { Applet } from '../lib';

const AppletList: FC<BoxProps> = props => {
  const { isLoading, error, data } = useAppletsQuery();

  const hasError = !!error;

  const applets: Applet[] | undefined = data?.data?.applets?.map<Applet>(
    dto => ({
      ...dto,
    }),
  );

  if (isLoading) {
    return <ActivityIndicator flex={1} />;
  }

  if (hasError) {
    return (
      <XStack flex={1} jc="center" ai="center">
        <LoadListError error="widget_error:error_text" />
      </XStack>
    );
  }

  return (
    <YStack {...props}>
      {applets?.map(x => (
        <Box mb={18} key={x.id}>
          <AppletCard applet={x} />
        </Box>
      ))}
    </YStack>
  );
};

export default AppletList;
