import { FC } from 'react';

import rules from '@shared/lib/markDownRules';
import { MarkdownView } from '@shared/ui';
import { YStack, ScrollView, ImageBackground, Box } from '@shared/ui';

const AboutAppletScreen: FC = () => {
  const mockContent =
    "## \n ### Applet Description \n\n This applet is part of the open source MindLogger data collection and analysis platform designed by the MATTER Lab at the Child Mind Institute ([https://matter.childmind.org](https://matter.childmind.org)). \n # \n ### What can MindLogger do? \n\n MindLogger's feature set is growing, and currently supports a wide variety of input types. Each screen in a MindLogger activity can include any of the following: \n  - Text, picture, and audio \n\n #### Where can I learn more? \n Please visit [https://mindlogger.org](https://mindlogger.org) for more information. \n\n ##### Cheers, \n\n ##### MindLogger Team \n\n ##### Child Mind Institute";

  let content = mockContent;

  if (content.startsWith('404:')) {
    content =
      '# ¯\\\\_(ツ)_/¯ ' +
      '\n # \n The authors of this applet have not provided any information!';
  }

  return (
    <YStack jc="flex-start" flex={1}>
      <ImageBackground>
        <ScrollView px="$5" pt="$2">
          <Box flex={1} mb="$3">
            <MarkdownView content={content} rules={rules} />
          </Box>
        </ScrollView>
      </ImageBackground>
    </YStack>
  );
};

export default AboutAppletScreen;
