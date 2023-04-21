import { FC } from 'react';

import { activityMarkDownStyles, markdownRules } from '@shared/lib';
import { MarkdownView, Box } from '@shared/ui';

type Props = {
  content: string;
  centerContent?: boolean;
};

const MarkdownMessage: FC<Props> = ({ content, centerContent }) => {
  return (
    <Box alignItems={centerContent ? 'center' : 'stretch'}>
      <MarkdownView
        content={content}
        rules={markdownRules}
        markdownStyle={activityMarkDownStyles}
      />
    </Box>
  );
};

export default MarkdownMessage;
