import { FC } from 'react';

import {
  activityMarkDownStyles,
  markDownRules,
} from '@app/shared/lib/markDownRules';

import { Box, BoxProps } from '../base';
import { MarkdownView } from '../MarkdownView';

type Props = {
  content: string;
} & BoxProps;

export const MarkdownMessage: FC<Props> = ({ content, ...styledProps }) => {
  return (
    <Box {...styledProps}>
      <MarkdownView
        content={content}
        rules={markDownRules}
        markdownStyle={activityMarkDownStyles}
      />
    </Box>
  );
};
