import { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IS_IOS } from '@app/shared/lib';
import {
  Box,
  KeyboardAvoidingView,
  MarkdownMessage,
  NumberSelector,
  ScrollButton,
  SimpleTextInput,
  SplashItem,
} from '@app/shared/ui';
import { AbTest } from '@entities/abTrail';
import { DrawingTest } from '@entities/drawer';
import { HtmlFlanker } from '@entities/flanker';
import {
  RadioActivityItem,
  SurveySlider,
  CheckBoxActivityItem,
} from '@shared/ui';

import AdditionalText from './AdditionalText';
import {
  PipelineItemAnswer,
  ActivityItem as ActivityItemProps,
  PipelineItemResponse,
} from '../lib';

type Props = ActivityItemProps &
  PipelineItemAnswer & {
    onResponse: (response: PipelineItemResponse) => void;
    onAdditionalResponse: (response: string) => void;
  };

function ActivityItem({
  type,
  value,
  pipelineItem,
  onResponse,
  onAdditionalResponse,
}: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const windowHeight = useWindowDimensions().height;

  const scrollViewRef = useRef<KeyboardAwareScrollView>();

  const [height, setHeight] = useState(0);

  let item: JSX.Element;
  const question = pipelineItem.question;

  const stopScrolling = () => setScrollEnabled(false);
  const releaseScrolling = () => setScrollEnabled(true);

  function scrollToEnd() {
    scrollViewRef.current?.scrollToEnd();
    setShowScrollButton(false);
  }

  switch (type) {
    case 'Splash':
      item = (
        <Box flex={1} onPressIn={stopScrolling} onPressOut={releaseScrolling}>
          <SplashItem config={pipelineItem.payload} />
        </Box>
      );
      break;

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
            value={value?.answer?.lines ?? []}
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

    case 'TextInput':
      item = (
        <Box mx={16}>
          <SimpleTextInput
            value={value?.answer ?? ''}
            config={pipelineItem.payload}
            onChange={onResponse}
          />
        </Box>
      );
      break;

    case 'Slider':
      item = (
        <Box mx={16}>
          <SurveySlider
            config={pipelineItem.payload}
            onChange={onResponse}
            onPress={() => console.log('pressed')}
            onRelease={() => console.log('released')}
            initialValue={value?.answer ?? undefined}
          />
        </Box>
      );
      break;

    case 'NumberSelect':
      item = (
        <Box flex={1} justifyContent="center" mx={16}>
          <NumberSelector
            value={value?.answer ?? ''}
            config={pipelineItem.payload}
            onChange={onResponse}
          />
        </Box>
      );
      break;

    case 'Checkbox':
      item = (
        <Box mx="$6">
          <CheckBoxActivityItem
            config={pipelineItem.payload}
            onChange={onResponse}
            values={value?.answer || []}
          />
        </Box>
      );
      break;

    case 'Radio':
      item = (
        <Box mx="$6">
          <RadioActivityItem
            config={pipelineItem.payload}
            onChange={onResponse}
            initialValue={value?.answer}
          />
        </Box>
      );
      break;

    default: {
      item = <></>;
    }
  }

  useLayoutEffect(() => {
    if (height > windowHeight) {
      setShowScrollButton(true);
    }
  }, [height, windowHeight]);

  return (
    <Box
      flex={1}
      onLayout={e => {
        setHeight(e.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView flex={1} behavior={IS_IOS ? 'padding' : 'height'}>
        <Box flex={1}>
          <KeyboardAwareScrollView
            innerRef={ref => {
              scrollViewRef.current = ref as unknown as KeyboardAwareScrollView;
            }}
            contentContainerStyle={styles.scrollView}
            onContentSizeChange={(_, contentHeight) => setHeight(contentHeight)}
            scrollEnabled={scrollEnabled}
            extraScrollHeight={10}
          >
            <Box flex={1} justifyContent="center">
              {question && (
                <Box mx={16} mb={20} alignItems="center">
                  <MarkdownMessage content={question} />
                </Box>
              )}

              {item}

              {pipelineItem.additionalText && (
                <Box mt={30} justifyContent="center" mx={16}>
                  <AdditionalText
                    value={value?.additionalAnswer}
                    onChange={onAdditionalResponse}
                    required={pipelineItem.additionalText.required}
                  />
                </Box>
              )}
            </Box>
          </KeyboardAwareScrollView>
        </Box>

        {showScrollButton && (
          <ScrollButton
            onPress={scrollToEnd}
            position="absolute"
            bottom={7}
            alignSelf="center"
          />
        )}
      </KeyboardAvoidingView>
    </Box>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
});

export default ActivityItem;
