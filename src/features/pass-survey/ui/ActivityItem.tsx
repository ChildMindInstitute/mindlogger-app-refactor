import { useCallback, useContext, useState } from 'react';

import {
  Box,
  GeolocationItem,
  MarkdownMessage,
  NumberSelector,
  SimpleTextInput,
  SplashItem,
  PhotoItem,
  VideoItem,
  ScrollableContent,
  DatePickerItem,
  TimePickerItem,
  StackedCheckBoxItem,
  StackedRadiosItem,
  StackedSlider,
} from '@app/shared/ui';
import { HandlersContext } from '@app/shared/ui';
import { AbTest } from '@entities/abTrail';
import { useAppletStreamingStatus } from '@entities/applet/lib/hooks';
import { DrawingTest } from '@entities/drawer';
import { HtmlFlanker, NativeIosFlanker } from '@entities/flanker';
import { StabilityTracker } from '@entities/stabilityTracker';
import { IS_ANDROID, useSendEvent } from '@shared/lib';
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
  ActivityIdentityContext,
} from '../lib';

type Props = ActivityItemProps &
  PipelineItemAnswer & {
    onResponse: (response: PipelineItemResponse) => void;
    onAdditionalResponse: (response: string) => void;
    textVariableReplacer: (markdown: string) => string;
    onContextChange: (contextKey: string, contextValue: unknown) => void;
    context: Record<string, unknown>;
  };

function ActivityItem({
  type,
  value,
  pipelineItem,
  onResponse,
  onAdditionalResponse,
  textVariableReplacer,
  onContextChange,
  context,
}: Props) {
  const { appletId } = useContext(ActivityIdentityContext);
  const streamEnabled = useAppletStreamingStatus(appletId);

  const initialScrollEnabled = type !== 'StabilityTracker' && type !== 'AbTest';

  const [scrollEnabled, setScrollEnabled] = useState(initialScrollEnabled);

  const { sendLiveEvent } = useSendEvent(streamEnabled);

  const { next } = useContext(HandlersContext);

  let item: JSX.Element | null;
  const question = pipelineItem.question;

  let alignMessageToLeft = false;

  const stopScrolling = () => setScrollEnabled(false);

  const releaseScrolling = () => setScrollEnabled(true);

  const onTimeIsUp = useCallback(() => {
    next(true);
  }, [next]);

  function moveToNextItem() {
    if (!pipelineItem.additionalText?.required) {
      setImmediate(() => next(true));
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
        <Box flex={1}>
          <AbTest
            testData={pipelineItem.payload}
            onResponse={onResponse}
            onLog={sendLiveEvent}
          />
        </Box>
      );
      break;

    case 'StabilityTracker':
      item = (
        <Box flex={1}>
          <StabilityTracker
            config={pipelineItem.payload}
            onComplete={response => {
              onResponse(response);
              moveToNextItem();
            }}
            onMaxLambdaChange={onContextChange}
            maxLambda={context?.maxLambda as number}
            onLog={sendLiveEvent}
          />
        </Box>
      );
      break;

    case 'DrawingTest':
      item = (
        <Box flex={1} mb="$6">
          <DrawingTest
            flex={1}
            {...pipelineItem.payload}
            toggleScroll={setScrollEnabled}
            value={{
              fileName: value?.answer?.fileName ?? null,
              lines: value?.answer?.lines ?? [],
            }}
            isDrawingActive={!scrollEnabled}
            onStarted={() => console.log('onStarted')}
            onResult={onResponse}
            onLog={sendLiveEvent}
          />
        </Box>
      );
      break;

    case 'Flanker':
      item = IS_ANDROID ? (
        <HtmlFlanker
          configuration={pipelineItem.payload}
          onResult={data => {
            onResponse(data);
            moveToNextItem();
          }}
          onLog={sendLiveEvent}
        />
      ) : (
        <NativeIosFlanker
          configuration={pipelineItem.payload}
          onResult={data => {
            onResponse(data);
            moveToNextItem();
          }}
          onLog={sendLiveEvent}
        />
      );
      break;

    case 'TextInput':
      item = (
        <Box mx={16} mb={16}>
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
        <Box mx={16} mb="$6">
          <SurveySlider
            config={pipelineItem.payload}
            onChange={onResponse}
            onPress={() => console.log('pressed')}
            onRelease={() => console.log('released')}
            initialValue={value?.answer ?? null}
          />
        </Box>
      );
      break;

    case 'NumberSelect':
      item = (
        <Box justifyContent="center" mb="$6" mx={16}>
          <NumberSelector
            value={value?.answer ?? ''}
            config={pipelineItem.payload}
            onChange={onResponse}
          />
        </Box>
      );
      break;

    case 'StackedSlider':
      item = (
        <Box mx="$6" mb="$6">
          <StackedSlider
            config={pipelineItem.payload}
            onChange={onResponse}
            values={value?.answer || null}
            onPress={() => console.log('pressed')}
            onRelease={() => console.log('released')}
          />
        </Box>
      );
      break;

    case 'StackedCheckbox':
      item = (
        <Box mx="$6">
          <StackedCheckBoxItem
            config={pipelineItem.payload}
            onChange={onResponse}
            values={value?.answer || null}
            textReplacer={textVariableReplacer}
          />
        </Box>
      );
      break;

    case 'StackedRadio':
      item = (
        <Box mx="$6">
          <StackedRadiosItem
            config={pipelineItem.payload}
            onChange={onResponse}
            values={value?.answer || []}
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
        <Box mx="$6" mb="$6">
          <AudioRecorderItem
            onChange={onResponse}
            value={value?.answer}
            config={pipelineItem.payload}
          />
        </Box>
      );
      break;

    case 'Message': {
      item = null;
      alignMessageToLeft = pipelineItem.payload.alignToLeft;
      break;
    }

    case 'AudioPlayer':
      item = (
        <Box mx="$6" mb="$6">
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
        <Box mx="$6" mb="$6">
          <TimeRangeItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    case 'Date':
      item = (
        <Box mx="$6" mb="$6">
          <DatePickerItem onChange={onResponse} value={value?.answer} />
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
        <Box mx="$6" mb="$6">
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

    case 'Time':
      item = (
        <Box mx="$6" mb="$6">
          <TimePickerItem onChange={onResponse} value={value?.answer} />
        </Box>
      );
      break;

    default: {
      item = <></>;
    }
  }

  return (
    <ScrollableContent scrollEnabled={scrollEnabled}>
      <Box flex={1} justifyContent="center">
        {question && (
          <Box mx={16} mb={20}>
            <MarkdownMessage
              flex={1}
              alignItems={alignMessageToLeft ? undefined : 'center'}
              content={textVariableReplacer(question)}
            />
          </Box>
        )}

        {!!pipelineItem.timer && (
          <Timer duration={pipelineItem.timer} onTimeIsUp={onTimeIsUp} />
        )}

        {item}

        {pipelineItem.additionalText && (
          <Box justifyContent="center" mt={30} mb={16} mx={16}>
            <AdditionalText
              value={value?.additionalAnswer}
              onChange={onAdditionalResponse}
              required={pipelineItem.additionalText.required}
            />
          </Box>
        )}
      </Box>
    </ScrollableContent>
  );
}

export default ActivityItem;
