import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import { activityMarkDownStyles } from '@shared/lib';

import { colors } from '../lib';
import { Popover, MarkdownView, ScrollView } from '../ui';

type TooltipProps = {
  children: React.ReactNode;
  markdown?: string;
};

const Tooltip: FC<TooltipProps> = ({ children, markdown }) => {
  if (!markdown) {
    return null;
  }

  return (
    <Popover placement="bottom" size="$4">
      <Popover.Trigger>{children}</Popover.Trigger>

      <Popover.Content
        width="$19"
        backgroundColor={colors.lighterGrey3}
        ml={10}
      >
        <ScrollView flex={1} maxHeight={300}>
          <MarkdownView
            content={markdown}
            markdownStyle={{
              ...activityMarkDownStyles,
              text: styles.markdownText,
            }}
          />
        </ScrollView>
      </Popover.Content>
    </Popover>
  );
};

const styles = StyleSheet.create({
  markdownText: {
    color: '#000',
  },
});

export default Tooltip;
