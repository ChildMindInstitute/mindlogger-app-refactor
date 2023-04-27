import { FC } from 'react';

import { activityMarkDownStyles, markdownRules } from '@shared/lib';
import { MarkdownView, Box, BoxProps } from '@shared/ui';

type Props = {
  content: string;
} & BoxProps;

const MarkdownMessage: FC<Props> = ({ content, ...styledProps }) => {
  return (
    <Box {...styledProps}>
      <MarkdownView
        content={content}
        rules={markdownRules}
        markdownStyle={activityMarkDownStyles}
      />
    </Box>
  );
};

export default MarkdownMessage;
