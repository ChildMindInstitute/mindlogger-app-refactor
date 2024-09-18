import { ComponentProps, useCallback, useContext, useState } from 'react';

import { useActivityAssignment } from '@app/entities/activity/lib/hooks/useActivityAssignment';
import ActivityAssignmentBadge from '@app/entities/activity/ui/ActivityAssignmentBadge';
import ActivityAssignmentBanner from '@app/entities/activity/ui/ActivityAssignmentBanner';
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
  ParagraphText,
  XStack,
} from '@app/shared/ui';
import { HandlersContext } from '@app/shared/ui';
import { AbTest } from '@entities/abTrail';
import { useAppletStreamingDetails } from '@entities/applet/lib/hooks';
import { DrawingTest } from '@entities/drawer';
import {
  FlankerGameResponse,
  HtmlFlanker,
  NativeIosFlanker,
} from '@entities/flanker';
import { StabilityTracker } from '@entities/stabilityTracker';
import {
  Dimensions,
  IS_ANDROID,
  LiveEvent,
  useSendEvent,
  wait,
} from '@shared/lib';
import {
  RadioActivityItem,
  SurveySlider,
  CheckBoxActivityItem,
  TimeRangeItem,
  AudioRecorderItem,
  AudioStimulusItem,
} from '@shared/ui';

import AdditionalText from './AdditionalText';
import {
  PipelineItemAnswer,
  ActivityItem as ActivityItemProps,
  PipelineItemResponse,
  ActivityIdentityContext,
} from '../lib';
import { mapStreamEventToDto } from '../model';

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
  const { appletId, activityId, flowId } = useContext(ActivityIdentityContext);
  const { assignment } = useActivityAssignment({
    appletId,
    activityId,
    activityFlowId: flowId,
  });

  const streamingDetails = useAppletStreamingDetails(appletId);

  const initialScrollEnabled = type !== 'StabilityTracker' && type !== 'AbTest';

  const [scrollEnabled, setScrollEnabled] = useState(initialScrollEnabled);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  const { sendLiveEvent } = useSendEvent(
    streamingDetails?.streamEnabled || false,
  );

  const processLiveEvent = (streamEvent: LiveEvent) => {
    const liveEventDto = mapStreamEventToDto(streamEvent);

    sendLiveEvent(liveEventDto);
  };

  const { next } = useContext(HandlersContext);

  let item: JSX.Element | null;
  const question = pipelineItem.question;

  let alignMessageToLeft = false;

  const stopScrolling = () => setScrollEnabled(false);

  const releaseScrolling = () => setScrollEnabled(true);

  const moveToNextItem = useCallback(() => {
    const isRadioItem = pipelineItem.type === 'Radio';
    const autoAdvanceDisabled =
      isRadioItem && !pipelineItem.payload.autoAdvance;
    const shouldAutoSubmit = !isRadioItem;

    if (!pipelineItem.additionalText?.required && !autoAdvanceDisabled) {
      setImmediate(() =>
        next({ isForced: true, shouldAutoSubmit: shouldAutoSubmit }),
      );
    }
  }, [next, pipelineItem]);

  const handleStabilityTrackerComplete = useCallback<
    ComponentProps<typeof StabilityTracker>['onComplete']
  >(
    response => {
      onResponse(response);
      moveToNextItem();
    },
    [moveToNextItem, onResponse],
  );

  const handleFlankerResult = useCallback<(data: FlankerGameResponse) => void>(
    data => {
      onResponse(data);
      moveToNextItem();
    },
    [moveToNextItem, onResponse],
  );

  const handleRadioChange = useCallback<
    ComponentProps<typeof RadioActivityItem>['onChange']
  >(
    async radioValue => {
      await wait(100);
      onResponse(radioValue);
      moveToNextItem();
    },
    [moveToNextItem, onResponse],
  );

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
            onLog={processLiveEvent}
          />
        </Box>
      );
      break;

    case 'StabilityTracker':
      item = (
        <Box flex={1}>
          <StabilityTracker
            config={pipelineItem.payload}
            onComplete={handleStabilityTrackerComplete}
            onMaxLambdaChange={onContextChange}
            maxLambda={context?.maxLambda as number}
            onLog={processLiveEvent}
          />
        </Box>
      );
      break;

    case 'DrawingTest':
      item = dimensions ? (
        <Box flex={1} mb="$6">
          <DrawingTest
            flex={1}
            dimensions={dimensions}
            {...pipelineItem.payload}
            toggleScroll={setScrollEnabled}
            value={{
              fileName: value?.answer?.fileName ?? null,
              lines: value?.answer?.lines ?? [],
            }}
            legacyLayoutSupport={!pipelineItem.payload.proportionEnabled}
            onResult={onResponse}
            onLog={processLiveEvent}
          />
        </Box>
      ) : null;
      break;

    case 'Flanker':
      item = IS_ANDROID ? (
        <HtmlFlanker
          configuration={pipelineItem.payload}
          onResult={handleFlankerResult}
          onLog={processLiveEvent}
        />
      ) : (
        <NativeIosFlanker
          configuration={pipelineItem.payload}
          onResult={handleFlankerResult}
          onLog={processLiveEvent}
        />
      );
      break;
    case 'ParagraphText':
      item = (
        <Box mx={16} mb={16}>
          <ParagraphText
            value={value?.answer ?? ''}
            config={pipelineItem.payload}
            onChange={onResponse}
          />
        </Box>
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
            accessibilityLabel="slider"
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
            tooltipsShown={pipelineItem.payload.addTooltip}
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
            textReplacer={textVariableReplacer}
            tooltipsShown={pipelineItem.payload.addTooltip}
          />
        </Box>
      );
      break;

    case 'Checkbox':
      item = (
        <Box mx={16}>
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
        <Box mx={16}>
          <RadioActivityItem
            config={pipelineItem.payload}
            onChange={handleRadioChange}
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
    <ScrollableContent scrollEnabled={scrollEnabled} scrollEventThrottle={100}>
      {assignment &&
        assignment.respondent.id !== assignment.target.id &&
        (() => {
          // TODO: Move this to the "welcome" screen.
          //       See: https://mindlogger.atlassian.net/browse/M2-7917
          // THIS IS NOT WHERE `<ActivityAssignmentBanner />` SHOULD GO!
          // The mobile app currently doesn't have a "welcome" screen like the
          // web app does, so the banner is rendered here (but disabled) for
          // demonstration purposes.
          // If you just want to see what the banner looks like, change the
          // line below to `return true`.
          return false;
        })() && (
          <ActivityAssignmentBanner
            assignment={assignment}
            accessibilityLabel="item_display_assignment_banner"
          />
        )}
      <Box
        flex={1}
        justifyContent="center"
        onLayout={e => {
          if (!dimensions) {
            setDimensions(e.nativeEvent.layout);
          }
        }}
      >
        {assignment && assignment.respondent.id !== assignment.target.id && (
          <XStack mx={16} mb={12}>
            <ActivityAssignmentBadge
              assignment={assignment}
              accessibilityLabel="item_display_assignment"
            />
            <Box flexGrow={1} flexShrink={1} />
          </XStack>
        )}

        {question && (
          <Box mx={16} mb={20}>
            <MarkdownMessage
              accessibilityLabel="item_display_content"
              flex={1}
              alignItems={alignMessageToLeft ? undefined : 'center'}
              content={textVariableReplacer(question)}
            />
          </Box>
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
