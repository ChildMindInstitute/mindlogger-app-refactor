import { useContext, useState } from 'react';

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
import { DrawingTest } from '@entities/drawer';
import { HtmlFlanker } from '@entities/flanker';
import { IS_ANDROID } from '@shared/lib';
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

function ActivityItem({
  type,
  value,
  pipelineItem,
  onResponse,
  onAdditionalResponse,
  textVariableReplacer,
}: Props) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const { next } = useContext(HandlersContext);

  let item: JSX.Element | null;
  const question = pipelineItem.question;

  const stopScrolling = () => setScrollEnabled(false);

  const releaseScrolling = () => setScrollEnabled(true);

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
        <Box
          flex={1}
          onPressIn={IS_ANDROID ? null : stopScrolling}
          onPressOut={IS_ANDROID ? null : releaseScrolling}
        >
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

    case 'StackedSlider':
      item = (
        <Box mx="$6">
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
            value={value?.answer || []}
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

    case 'Date':
      item = (
        <Box mx="$6">
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

    case 'Time':
      item = (
        <Box mx="$6">
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
              alignItems="center"
              content={textVariableReplacer(question)}
            />
          </Box>
        )}

        {!!pipelineItem.timer && (
          <Timer duration={pipelineItem.timer} onTimeIsUp={next} />
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
