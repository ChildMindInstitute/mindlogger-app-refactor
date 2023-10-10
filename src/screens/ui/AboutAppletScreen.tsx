import { FC } from 'react';
import { type FlexAlignType } from 'react-native';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { UploadRetryBanner } from '@app/entities/activity';
import { useAppletDetailsQuery } from '@app/entities/applet';
import { MarkdownMessage } from '@shared/ui';
import { YStack, ScrollView } from '@shared/ui';

import { AppletDetailsParamList } from '../config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'About'>;

const AboutAppletScreen: FC<Props> = ({ route }) => {
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
    console.log(t('applet_about.no_info'));
    alignItems = 'flex-start';
    content = '# ¯\\\\_(ツ)_/¯ ' + '\n ' + t('applet_about:no_info');
  } else {
    alignItems = 'center';
    content = appletAbout;
  }

  return (
    <YStack jc="flex-start" flex={1}>
      <UploadRetryBanner />

      <ScrollView px="$5" pt="$2">
        <MarkdownMessage
          data-test="about-applet-markup-view"
          flex={1}
          mb="$3"
          alignItems={alignItems}
          content={content}
        />
      </ScrollView>
    </YStack>
  );
};

export default AboutAppletScreen;
