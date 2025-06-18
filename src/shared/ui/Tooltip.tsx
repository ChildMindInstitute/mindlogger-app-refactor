import React, { FC } from 'react';
import { AccessibilityProps, StyleSheet } from 'react-native';

import Popover from 'react-native-popover-view';

import { YStack } from './base';
import { MarkdownView } from './MarkdownView';
import { ScrollView } from './ScrollView';
import { palette } from '../lib/constants/palette';
import { activityMarkDownStyles, markDownRules } from '../lib/markdown/rules';

type TooltipProps = {
  children: React.ReactNode;
  markdown?: string;
  triggerAccessibilityLabel?: string | null;
  hitSlop?: number;
};

export const Tooltip: FC<TooltipProps & AccessibilityProps> = ({
  children,
  markdown,
  hitSlop = 40,
  accessibilityLabel,
  triggerAccessibilityLabel,
}) => {
  if (!markdown) {
    return null;
  }

  return (
    <Popover
      popoverStyle={styles.popover}
      from={
        <YStack
          hitSlop={hitSlop}
          accessibilityLabel={triggerAccessibilityLabel ?? 'tooltip-button'}
        >
          {children}
        </YStack>
      }
    >
      <ScrollView
        accessibilityLabel={accessibilityLabel}
        flex={1}
        maxHeight={300}
      >
        <MarkdownView
          content={markdown}
          rules={markDownRules}
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
    backgroundColor: palette.lighterGrey3,
    width: 250,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  markdownText: {
    color: '#000',
  },
});
