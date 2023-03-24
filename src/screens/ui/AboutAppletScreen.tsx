import { FC, useMemo } from 'react';

import { useRoute } from '@react-navigation/native';

import { useAppletDetailsQuery } from '@app/entities/applet';
import rules from '@shared/lib/markDownRules';
import { MarkdownView } from '@shared/ui';
import { YStack, ScrollView, Box } from '@shared/ui';

type RouteProps = {
  key: string;
  name: string;
  params: {
    appletId: string;
  };
};

const AboutAppletScreen: FC = () => {
  const {
    params: { appletId },
  } = useRoute<RouteProps>();

  const { data: appletAbout } = useAppletDetailsQuery(appletId, {
    select: r => r.data.result?.about,
  });

  const aboutText = useMemo(() => {
    if (!appletAbout || appletAbout.startsWith('404:')) {
      return (
        '# ¯\\\\_(ツ)_/¯ ' +
        '\n # \n The authors of this applet have not provided any information!'
      );
    }

    return appletAbout;
  }, [appletAbout]);

  return (
    <YStack jc="flex-start" flex={1}>
      <ScrollView px="$5" pt="$2">
        <Box flex={1} mb="$3">
          <MarkdownView content={aboutText} rules={rules} />
        </Box>
      </ScrollView>
    </YStack>
  );
};

export default AboutAppletScreen;
