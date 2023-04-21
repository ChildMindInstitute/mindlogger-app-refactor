import { useContext, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IS_ANDROID, IS_IOS } from '@app/shared/lib';
import {
  Box,
  GeolocationItem,
  KeyboardAvoidingView,
  MarkdownMessage,
  NumberSelector,
  ScrollButton,
  SimpleTextInput,
  SplashItem,
  PhotoItem,
  VideoItem,
} from '@app/shared/ui';
import { HandlersContext } from '@app/shared/ui';
import { AbTest } from '@entities/abTrail';
import { DrawingTest } from '@entities/drawer';
import { HtmlFlanker } from '@entities/flanker';
import {
  RadioActivityItem,
  SurveySlider,
  CheckBoxActivityItem,
  TimeRangeItem,
  AudioRecorderItem,
  AudioStimulusItem,
} from '@shared/ui';

import AdditionalText from './AdditionalText';
import Timer from './Timer';
import {
  PipelineItemAnswer,
  ActivityItem as ActivityItemProps,
  PipelineItemResponse,
} from '../lib';

type Props = ActivityItemProps &
  PipelineItemAnswer & {
    onResponse: (response: PipelineItemResponse) => void;
    onAdditionalResponse: (response: string) => void;
    textVariableReplacer: (markdown: string) => string;
  };

const ContentInsetVertical = IS_ANDROID ? 0 : 60;

const ScrollButtonRefreshTimeout = 300;

function ActivityItem({
  type,
  value,
  pipelineItem,
  onResponse,
  onAdditionalResponse,
  textVariableReplacer,
}: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const [showScrollButton, setShowScrollButton] = useState(false);

  const { next } = useContext(HandlersContext);

  const scrollViewRef = useRef<KeyboardAwareScrollView>();

  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const [scrollContentHeight, setScrollContentHeight] = useState<number | null>(
    null,
  );

  const [endOfContentAchievedOnce, setEndOfContentAchievedOnce] =
    useState(false);

  const scrollButtonTimeoutId = useRef<number | undefined>(undefined);

  let item: JSX.Element | null;
  const question = pipelineItem.question;

  const stopScrolling = () => setScrollEnabled(false);
  const releaseScrolling = () => setScrollEnabled(true);

  function scrollToEnd() {
    scrollViewRef.current?.scrollToEnd();
    setShowScrollButton(false);
  }

  function moveToNextItem() {
    if (!pipelineItem.additionalText?.required) {
      setImmediate(next);
    }
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
            textReplacer={textVariableReplacer}
          />
        </Box>
      );
      break;

    case 'Audio':
      item = (
        <Box mx="$6">
          <AudioRecorderItem
            onChange={onResponse}
            value={value?.answer}
            config={pipelineItem.payload}
          />
        </Box>
      );
      break;

    case 'Message':
      item = null;
      break;

    case 'AudioPlayer':
      item = (
        <Box mx="$6">
          <AudioStimulusItem
            onChange={onResponse}
            value={value?.answer || false}
            config={pipelineItem.payload}
          />
        </Box>
      );
      break;

    case 'TimeRange':
      item = (
        <Box mx="$6">
          <TimeRangeItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    case 'Radio':
      item = (
        <Box mx="$6">
          <RadioActivityItem
            config={pipelineItem.payload}
            onChange={radioValue => {
              onResponse(radioValue);
              moveToNextItem();
            }}
            initialValue={value?.answer}
            textReplacer={textVariableReplacer}
          />
        </Box>
      );
      break;

    case 'Geolocation':
      item = (
        <Box mx="$6">
          <GeolocationItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    case 'Photo':
      item = (
        <Box mx="$6">
          <PhotoItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    case 'Video':
      item = (
        <Box mx="$6">
          <VideoItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    default: {
      item = <></>;
    }
  }

  useEffect(() => {
    if (!containerHeight || !scrollContentHeight) {
      return;
    }

    if (scrollContentHeight > containerHeight && !endOfContentAchievedOnce) {
      scrollButtonTimeoutId.current = setTimeout(() => {
        setShowScrollButton(true);
      }, ScrollButtonRefreshTimeout);
    } else {
      clearTimeout(scrollButtonTimeoutId.current);
      scrollButtonTimeoutId.current = undefined;

      setShowScrollButton(false);
    }
  }, [containerHeight, scrollContentHeight, endOfContentAchievedOnce]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const achieved =
      Math.round(layoutMeasurement.height + contentOffset.y) >=
      Math.round(contentSize.height + ContentInsetVertical);

    if (!endOfContentAchievedOnce && achieved) {
      setEndOfContentAchievedOnce(achieved);
    }
  };

  return (
    <Box
      flex={1}
      onLayout={e => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <KeyboardAvoidingView flex={1} behavior={IS_IOS ? 'padding' : 'height'}>
        <Box flex={1}>
          <KeyboardAwareScrollView
            innerRef={ref => {
              scrollViewRef.current = ref as unknown as KeyboardAwareScrollView;
            }}
            contentContainerStyle={styles.scrollView}
            onContentSizeChange={(_, contentHeight) => {
              setScrollContentHeight(contentHeight);
            }}
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyboardOpeningTime={0}
            contentInset={{ top: 0, bottom: ContentInsetVertical }}
            enableOnAndroid
            onScroll={onScroll}
            scrollEventThrottle={50}
          >
            <Box flex={1} justifyContent="center">
              {question && (
                <Box mx={16} mb={20}>
                  <MarkdownMessage centerContent content={question} />
                </Box>
              )}

              {pipelineItem.timer && (
                <Timer duration={pipelineItem.timer} onTimeIsUp={next} />
              )}

              {item}

              {pipelineItem.additionalText && (
                <Box justifyContent="center" mt={30} mx={16}>
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
