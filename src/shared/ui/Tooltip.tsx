import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import Popover from 'react-native-popover-view';

import { activityMarkDownStyles, markdownRules } from '@shared/lib';

import { colors } from '../lib';
import { MarkdownView, ScrollView, YStack } from '../ui';

type TooltipProps = {
  children: React.ReactNode;
  markdown?: string | null;
};

const Tooltip: FC<TooltipProps> = ({ children, markdown }) => {
  if (!markdown) {
    if (children) {
      return <YStack hitSlop={40}>{children}</YStack>;
    }
    return null;
  }

  return (
    <Popover
      popoverStyle={styles.popover}
      from={<YStack hitSlop={40}>{children}</YStack>}
    >
      <ScrollView flex={1} maxHeight={300}>
        <MarkdownView
          content={markdown}
          rules={markdownRules}
          markdownStyle={{
            ...activityMarkDownStyles,
            text: styles.markdownText,
          }}
        />
      </ScrollView>
    </Popover>
  );
};

const styles = StyleSheet.create({
  popover: {
    borderRadius: 10,
    backgroundColor: colors.lighterGrey3,
    width: 250,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  markdownText: {
    color: '#000',
  },
});

export default Tooltip;
