import { ComponentProps, FC } from 'react';

import {
  activityMarkDownStyles,
  markDownRules,
} from '@shared/lib/markdown/rules';

import { Box, BoxProps } from '../base';
import { MarkdownView } from '../MarkdownView';

type Props = {
  content: string;
  rules?: ComponentProps<typeof MarkdownView>['rules'];
} & BoxProps;

export const MarkdownMessage: FC<Props> = ({
  content,
  rules,
  ...styledProps
}) => {
  return (
    <Box {...styledProps}>
      <MarkdownView
        content={content}
        rules={{ ...markDownRules, ...rules }}
        markdownStyle={activityMarkDownStyles}
      />
    </Box>
  );
};
