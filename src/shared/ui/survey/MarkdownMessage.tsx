import { FC } from 'react';

import { activityMarkDownStyles, markdownRules } from '@shared/lib';
import { MarkdownView } from '@shared/ui';

type Props = {
  content: string;
};

const MarkdownMessage: FC<Props> = ({ content }) => {
  return (
    <MarkdownView
      content={content}
      rules={markdownRules}
      markdownStyle={activityMarkDownStyles}
    />
  );
};

export default MarkdownMessage;
