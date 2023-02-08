import { FC } from 'react';

import rules from '@shared/lib/markDownRules';
import { MarkdownView } from '@shared/ui';
import { YStack, ScrollView, ImageBackground } from '@shared/ui';

const AppletAboutScreen: FC = () => {
  let text = 'mock markdown text';

  if (text.startsWith('404:')) {
    text =
      '# ¯\\\\_(ツ)_/¯ ' +
      '\n # \n The authors of this applet have not provided any information!';
  }

  return (
    <YStack jc="flex-start" flex={1}>
      <ImageBackground>
        <ScrollView px="$5" pt="$2" mb="$5">
          <MarkdownView content={text} rules={rules} />
        </ScrollView>
      </ImageBackground>
    </YStack>
  );
};

export default AppletAboutScreen;
