import { FC } from 'react';

import { HorizontalCalendar } from '@shared/ui';
import { YStack, ImageBackground } from '@shared/ui';

const AppletActivityScreen: FC = () => {
  return (
    <YStack jc="flex-start" flex={1}>
      <ImageBackground>
        <HorizontalCalendar />
      </ImageBackground>
    </YStack>
  );
};

export default AppletActivityScreen;
