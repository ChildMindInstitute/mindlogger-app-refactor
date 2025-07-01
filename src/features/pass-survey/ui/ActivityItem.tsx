import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AbTest } from '@app/entities/abTrail/ui/AbTest';
import { useActivityAssignment } from '@app/entities/activity/lib/hooks/useActivityAssignment';
import { ActivityAssignmentBanner } from '@app/entities/activity/ui/ActivityAssignmentBanner';
import { useAppletStreamingDetails } from '@app/entities/applet/lib/hooks/useAppletStreamingDetails';
import { DrawingTest } from '@app/entities/drawer/ui/DrawingTest/DrawingTest';
import { FlankerGameResponse } from '@app/entities/flanker/lib/types/response';
import { HtmlFlanker } from '@app/entities/flanker/ui/HtmlFlanker/HtmlFlanker';
import { NativeIosFlanker } from '@app/entities/flanker/ui/NativeIosFlanker/NativeIosFlanker';
import { StabilityTracker } from '@app/entities/stabilityTracker/ui/StabilityTracker';
import { IS_ANDROID } from '@app/shared/lib/constants';
import { LiveEvent } from '@app/shared/lib/tcp/types';
import { useSendEvent } from '@app/shared/lib/tcp/useSendLiveEvent';
import { Dimensions } from '@app/shared/lib/types/space';
import { wait } from '@app/shared/lib/utils/common';
import { Box } from '@app/shared/ui/base';
import { ScrollableContent } from '@app/shared/ui/ScrollableContent';
import { HandlersContext } from '@app/shared/ui/Stepper/contexts';
import { AudioRecorderItem } from '@app/shared/ui/survey/AudioRecorderItem';
import { AudioStimulusItem } from '@app/shared/ui/survey/AudioStimulusItem';
import { CheckBoxActivityItem } from '@app/shared/ui/survey/CheckBox/CheckBoxActivity.item';
import { DatePickerItem } from '@app/shared/ui/survey/DatePickerItem';
import { GeolocationItem } from '@app/shared/ui/survey/Geolocation/GeolocationItem';
import { ItemMarkdown } from '@app/shared/ui/survey/ItemMarkdown';
import { PhotoItem } from '@app/shared/ui/survey/MediaItems/PhotoItem';
import { VideoItem } from '@app/shared/ui/survey/MediaItems/VideoItem';
import { NumberSelector } from '@app/shared/ui/survey/NumberSelector';
import { ParagraphText } from '@app/shared/ui/survey/ParagraphText';
import { RadioActivityItem } from '@app/shared/ui/survey/RadioActivityItem/RadioActivityItem';
import { RequestHealthRecordDataItem } from '@app/shared/ui/survey/RequestHealthRecordDataItem/RequestHealthRecordDataItem';
import { SimpleTextInput } from '@app/shared/ui/survey/SimpleTextInput';
import { StackedSlider } from '@app/shared/ui/survey/Slider/StackedSlider';
import { SurveySlider } from '@app/shared/ui/survey/Slider/SurveySlider';
import { SplashItem } from '@app/shared/ui/survey/SplashItem';
import { StackedCheckboxItem } from '@app/shared/ui/survey/StackedCheckboxItem/StackedCheckboxItem';
import { StackedRadios } from '@app/shared/ui/survey/StackedRadioItem/StackedRadiosItem';
import { TimePickerItem } from '@app/shared/ui/survey/TimePickerItem';
import { TimeRangeItem } from '@app/shared/ui/survey/TimeRangeItem';
import { UnityView } from '@entities/unity/ui/UnityView';

import { AdditionalText } from './AdditionalText';
import { ActivityIdentityContext } from '../lib/contexts/ActivityIdentityContext';
import { ActivityItem as ActivityItemProps } from '../lib/types/activityItem';
import { PipelineItemResponse } from '../lib/types/payload';
import { PipelineItemAnswer } from '../lib/types/pipelineItemAnswer';
import { mapStreamEventToDto } from '../model/streamEventMapper';

type Props = ActivityItemProps &
  PipelineItemAnswer & {
    onResponse: (response: PipelineItemResponse) => void;
    onAdditionalResponse: (response: string) => void;
    textVariableReplacer: (markdown: string) => string;
    onContextChange: (contextKey: string, contextValue: unknown) => void;
    context: Record<string, unknown>;
  };

export function ActivityItem({
  type,
  value,
  pipelineItem,
  onResponse,
  onAdditionalResponse,
  textVariableReplacer,
  onContextChange,
  context,
}: Props) {
  const { appletId, activityId, flowId, targetSubjectId } = useContext(
    ActivityIdentityContext,
  );
  const textVariableReplacerRef = useRef(textVariableReplacer);

  const { assignment } = useActivityAssignment({
    appletId,
    activityId,
    activityFlowId: flowId || null,
    targetSubjectId,
  });

  const streamingDetails = useAppletStreamingDetails(appletId);

  const initialScrollEnabled = type !== 'StabilityTracker' && type !== 'AbTest';

  const [scrollEnabled, setScrollEnabled] = useState(initialScrollEnabled);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  const { sendLiveEvent } = useSendEvent(
    streamingDetails?.streamEnabled || false,
  );

  const processLiveEvent = useCallback(
    (streamEvent: LiveEvent) => {
      const liveEventDto = mapStreamEventToDto(streamEvent);

      sendLiveEvent(liveEventDto);
    },
    [sendLiveEvent],
  );

  const { next } = useContext(HandlersContext);

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

  const {
    question = pipelineItem.question,
    item,
    alignMessageToLeft = false,
    noScrollContainer = false,
  } = useMemo((): {
    question?: string | null;
    item: JSX.Element | null;
    alignMessageToLeft?: boolean;
    noScrollContainer?: boolean;
  } => {
    switch (type) {
      case 'Splash':
        return {
          item: (
            <Box flex={1}>
              <SplashItem config={pipelineItem.payload} />
            </Box>
          ),
        };
      case 'AbTest':
        return {
          item: (
            <Box flex={1}>
              <AbTest
                testData={pipelineItem.payload}
                onResponse={onResponse}
                onLog={processLiveEvent}
              />
            </Box>
          ),
        };
      case 'StabilityTracker':
        return {
          item: (
            <Box flex={1}>
              <StabilityTracker
                config={pipelineItem.payload}
                onComplete={handleStabilityTrackerComplete}
                onMaxLambdaChange={onContextChange}
                maxLambda={context?.maxLambda as number}
                onLog={processLiveEvent}
              />
            </Box>
          ),
        };
      case 'DrawingTest':
        return {
          item: dimensions ? (
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
          ) : null,
        };
      case 'Flanker':
        return {
          item: IS_ANDROID ? (
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
          ),
        };
      case 'ParagraphText':
        return {
          item: (
            <Box mx={16} mb={16}>
              <ParagraphText
                value={value?.answer ?? ''}
                config={pipelineItem.payload}
                onChange={onResponse}
              />
            </Box>
          ),
        };
      case 'TextInput':
        return {
          item: (
            <Box mx={16} mb={16}>
              <SimpleTextInput
                value={value?.answer ?? ''}
                config={pipelineItem.payload}
                onChange={onResponse}
              />
            </Box>
          ),
        };
      case 'Slider':
        return {
          item: (
            <Box mx={16} mb="$6">
              <SurveySlider
                config={pipelineItem.payload}
                onChange={onResponse}
                accessibilityLabel="slider"
                initialValue={value?.answer ?? null}
              />
            </Box>
          ),
        };
      case 'NumberSelect':
        return {
          item: (
            <Box justifyContent="center" mb="$6" mx={16}>
              <NumberSelector
                value={value?.answer ?? ''}
                config={pipelineItem.payload}
                onChange={onResponse}
              />
            </Box>
          ),
        };
      case 'StackedSlider':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <StackedSlider
                config={pipelineItem.payload}
                onChange={onResponse}
                values={value?.answer || null}
              />
            </Box>
          ),
        };
      case 'StackedCheckbox':
        return {
          item: (
            <Box mx="$6">
              <StackedCheckboxItem
                config={pipelineItem.payload}
                onChange={onResponse}
                values={value?.answer || null}
                textReplacer={textVariableReplacerRef.current}
                tooltipsShown={pipelineItem.payload.addTooltip}
              />
            </Box>
          ),
        };
      case 'StackedRadio':
        return {
          item: (
            <Box mx="$6">
              <StackedRadios
                config={pipelineItem.payload}
                onChange={onResponse}
                values={value?.answer || []}
                textReplacer={textVariableReplacerRef.current}
                tooltipsShown={pipelineItem.payload.addTooltip}
              />
            </Box>
          ),
        };
      case 'Checkbox':
        return {
          item: (
            <Box mx={16}>
              <CheckBoxActivityItem
                config={pipelineItem.payload}
                onChange={onResponse}
                values={value?.answer || []}
                textReplacer={textVariableReplacerRef.current}
              />
            </Box>
          ),
        };
      case 'Audio':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <AudioRecorderItem
                onChange={onResponse}
                value={value?.answer}
                config={pipelineItem.payload}
              />
            </Box>
          ),
        };
      case 'Message':
        return {
          item: null,
          alignMessageToLeft: pipelineItem.payload.alignToLeft,
        };
      case 'AudioPlayer':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <AudioStimulusItem
                onChange={onResponse}
                value={value?.answer || false}
                config={pipelineItem.payload}
              />
            </Box>
          ),
        };
      case 'TimeRange':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <TimeRangeItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'Date':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <DatePickerItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'Radio':
        return {
          item: (
            <Box mx={16}>
              <RadioActivityItem
                config={pipelineItem.payload}
                onChange={handleRadioChange}
                initialValue={value?.answer}
                textReplacer={textVariableReplacerRef.current}
              />
            </Box>
          ),
        };
      case 'Geolocation':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <GeolocationItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'Photo':
        return {
          item: (
            <Box mx="$6">
              <PhotoItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'Video':
        return {
          item: (
            <Box mx="$6">
              <VideoItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'Time':
        return {
          item: (
            <Box mx="$6" mb="$6">
              <TimePickerItem onChange={onResponse} value={value?.answer} />
            </Box>
          ),
        };
      case 'RequestHealthRecordData':
        return {
          item: (
            <RequestHealthRecordDataItem
              item={pipelineItem}
              onChange={onResponse}
              responseValue={value?.answer}
              textReplacer={textVariableReplacerRef.current}
              assignment={assignment}
            />
          ),
          question: null,
          noScrollContainer: true,
        };
      case 'Unity':
        return {
          item: (
            <Box flex={1}>
              <UnityView payload={pipelineItem.payload} />
            </Box>
          ),
        };
      default:
        return {
          item: <></>,
        };
    }
  }, [
    assignment,
    context?.maxLambda,
    dimensions,
    handleFlankerResult,
    handleRadioChange,
    handleStabilityTrackerComplete,
    onContextChange,
    onResponse,
    pipelineItem,
    processLiveEvent,
    type,
    value?.answer,
  ]);

  const Wrapper: FC<PropsWithChildren> = useCallback(
    ({ children }) => {
      return noScrollContainer ? (
        <>{children}</>
      ) : (
        <ScrollableContent scrollEnabled={scrollEnabled}>
          {children}
        </ScrollableContent>
      );
    },
    [noScrollContainer, scrollEnabled],
  );

  const itemMarkdown = useMemo(
    () =>
      !!question && (
        <ItemMarkdown
          content={question}
          assignment={assignment}
          alignToLeft={alignMessageToLeft}
          textVariableReplacer={textVariableReplacerRef.current}
          mx={16}
          mb={20}
        />
      ),
    [alignMessageToLeft, assignment, question],
  );

  return (
    <Wrapper>
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
        {itemMarkdown}

        {item}

        {pipelineItem.additionalText && (
          <Box justifyContent="center" m={16} mb={32}>
            <AdditionalText
              value={value?.additionalAnswer}
              onChange={onAdditionalResponse}
              required={pipelineItem.additionalText.required}
            />
          </Box>
        )}
      </Box>
    </Wrapper>
  );
}
