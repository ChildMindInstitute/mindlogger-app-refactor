import { FC } from 'react';
import { type FlexAlignType } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { useAppletDetailsQuery } from '@app/entities/applet/api/hooks/useAppletDetailsQuery';
import { Box, YStack } from '@app/shared/ui/base';
import { GradientOverlay } from '@app/shared/ui/GradientOverlay';
import { ScrollView } from '@app/shared/ui/ScrollView';
import { MarkdownMessage } from '@app/shared/ui/survey/MarkdownMessage';
import { UploadRetryBanner } from '@app/widgets/survey/ui/UploadRetryBanner';

import { AppletDetailsParamList } from '../config/types';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'About'>;

export const AboutAppletScreen: FC<Props> = ({ route }) => {
  const { t } = useTranslation();
  let content;
  let alignItems: FlexAlignType;

  const {
    params: { appletId },
  } = route;

  const { data: appletAbout } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result?.about,
  });

  if (!appletAbout || appletAbout.startsWith('404:')) {
    alignItems = 'flex-start';
    content = t('applet_about:no_info');
  } else {
    alignItems = 'center';
    content = appletAbout;
  }

  return (
    <YStack jc="flex-start" flex={1} bg="$surface1">
      <UploadRetryBanner />

      <Box flex={1}>
        <ScrollView px="$5" pt="$2">
          <MarkdownMessage
            aria-label="about-applet-markup-view"
            flex={1}
            mb="$3"
            alignItems={alignItems}
            content={content}
          />
        </ScrollView>
        <GradientOverlay position="top" />
        <GradientOverlay position="bottom" />
      </Box>
    </YStack>
  );
};
