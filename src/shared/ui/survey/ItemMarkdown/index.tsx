import { FC } from 'react';

import { RenderFunction } from 'react-native-markdown-display';

import type { Assignment } from '@app/entities/activity/lib/types/activityAssignment';
import { ActivityAssignmentBadge } from '@app/entities/activity/ui/ActivityAssignmentBadge';
import { Box, BoxProps, XStack } from '@app/shared/ui/base';
import { markDownRules } from '@shared/lib/markdown/rules';
import { insertAfterMedia } from '@shared/lib/markdown/utils';

import { MarkdownMessage } from '../MarkdownMessage';

type ItemMarkdownProps = {
  content: string;
  accessibilityLabel?: string;
  alignToLeft?: boolean;
  assignment?: Assignment | null;
  textVariableReplacer?: (text: string) => string;
} & BoxProps;

export const ItemMarkdown: FC<ItemMarkdownProps> = ({
  content,
  accessibilityLabel = 'item_display_content',
  alignToLeft = false,
  assignment,
  textVariableReplacer = text => text,
  ...boxProps
}) => {
  const processedContent =
    assignment && assignment.respondent.id !== assignment.target.id
      ? insertAfterMedia(
          textVariableReplacer(content),
          `<div data-is-assignment-badge />`,
        )
      : textVariableReplacer(content);

  return (
    <Box {...boxProps}>
      <MarkdownMessage
        accessibilityLabel={accessibilityLabel}
        flex={1}
        alignItems={alignToLeft ? undefined : 'center'}
        content={processedContent}
        rules={{
          html_block: (...args: Parameters<RenderFunction>) => {
            const [node] = args;

            if (assignment && node.content.match(/ata-is-assignment-badge/)) {
              return (
                <XStack mb={12}>
                  {alignToLeft ? null : <Box flexGrow={1} flexShrink={1} />}
                  <ActivityAssignmentBadge
                    assignment={assignment}
                    aria-label="item_display_assignment"
                  />
                  <Box flexGrow={1} flexShrink={1} />
                </XStack>
              );
            }

            return (markDownRules.html_block as RenderFunction)(...args);
          },
        }}
      />
    </Box>
  );
};
