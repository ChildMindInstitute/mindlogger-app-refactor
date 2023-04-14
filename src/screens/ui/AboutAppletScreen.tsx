import { FC } from 'react';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useAppletDetailsQuery } from '@app/entities/applet';
import rules from '@shared/lib/markDownRules';
import { MarkdownView } from '@shared/ui';
import { YStack, ScrollView, Box } from '@shared/ui';

import { AppletDetailsParamList } from '../config';

type Props = BottomTabScreenProps<AppletDetailsParamList, 'About'>;

const AboutAppletScreen: FC<Props> = ({ route }) => {
  let content;
  const {
    params: { appletId },
  } = route;

  const { data: appletAbout } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result?.about,
  });

  if (!appletAbout || appletAbout.startsWith('404:')) {
    content =
      '# ¯\\\\_(ツ)_/¯ ' +
      '\n # \n The authors of this applet have not provided any information!';
  } else {
    content = appletAbout;
  }

  return (
    <YStack jc="flex-start" flex={1}>
      <ScrollView px="$5" pt="$2">
        <Box flex={1} mb="$3">
          <MarkdownView content={content} rules={rules} />
        </Box>
      </ScrollView>
    </YStack>
  );
};

export default AboutAppletScreen;
