import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Box, MarkdownMessage, ScrollView } from '@app/shared/ui';
import { AbTest } from '@entities/abTrail';
import { DrawingTest } from '@entities/drawer';
import { HtmlFlanker } from '@entities/flanker';

import { PipelineItem, PipelineItemResponse } from '../lib';

type Props = {
  value: any;
  pipelineItem: PipelineItem;
  onResponse: (response: PipelineItemResponse) => void;
};

function ActivityItem({ value, pipelineItem, onResponse }: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  let item: JSX.Element;
  const question = pipelineItem.question;

  const stopScrolling = () => setScrollEnabled(false);
  const releaseScrolling = () => setScrollEnabled(true);

  switch (pipelineItem.type) {
    case 'AbTest':
      item = (
        <Box flex={1} onPressIn={stopScrolling} onPressOut={releaseScrolling}>
          <AbTest {...pipelineItem.payload} onComplete={onResponse} />
        </Box>
      );
      break;

    case 'DrawingTest':
      item = (
        <Box flex={1} onPressIn={stopScrolling} onPressOut={releaseScrolling}>
          <DrawingTest
            flex={1}
            {...pipelineItem.payload}
            initialLines={value?.lines ?? []}
            onStarted={() => console.log('onStarted')}
            onResult={onResponse}
          />
        </Box>
      );
      break;

    case 'Flanker':
      item = (
        <HtmlFlanker
          configuration={pipelineItem.payload}
          onResult={onResponse}
          onComplete={() => console.log('onComplete')}
        />
      );
      break;

    default: {
      item = <></>;
    }
  }

  return (
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        scrollEnabled={scrollEnabled}
      >
        {question && (
          <Box mx={16} mb={20}>
            <MarkdownMessage content={question} />
          </Box>
        )}

        <Box flex={1}>{item}</Box>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityItem;
