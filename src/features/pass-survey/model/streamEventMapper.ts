import { IS_ANDROID } from '@app/shared/lib/constants';
import {
  AbTestStreamEventDto,
  AbTestStreamEventErrorType,
  AbTestStreamEvent,
  DrawingStreamEvent,
  DrawingStreamEventDto,
  StabilityTrackerEvent,
  StabilityTrackerEventDto,
  LiveEvent,
  FlankerLiveEvent,
  LiveEventDto,
} from '@shared/lib/tcp/types';

const mapABTestStreamEventToDto = (
  streamEvent: AbTestStreamEvent,
): AbTestStreamEventDto => {
  let actualPath = '?';

  if (streamEvent.wrongPointLabel) {
    actualPath = streamEvent.wrongPointLabel;
  }
  if (streamEvent.error === AbTestStreamEventErrorType.OverCorrectPoint) {
    actualPath = streamEvent.nextNodeLabel;
  }
  if (streamEvent.error === AbTestStreamEventErrorType.OverUndefinedPoint) {
    actualPath = '-1';
  }

  const dto = {
    x: streamEvent.x,
    y: streamEvent.y,
    time: streamEvent.time,
    line_number: streamEvent.lineNumber,
    error: streamEvent.error,
    correct_path: `${streamEvent.currentNodeLabel} ~ ${streamEvent.nextNodeLabel}`,
    actual_path: actualPath,
  };

  return dto;
};
const mapDrawingStreamEventToDto = (
  streamEvent: DrawingStreamEvent,
): DrawingStreamEventDto => {
  const dto = {
    x: streamEvent.x,
    y: streamEvent.y,
    line_number: streamEvent.lineNumber,
    time: streamEvent.time,
  };

  return dto;
};

const mapStabilityTrackerStreamEventToDto = (
  streamEvent: StabilityTrackerEvent,
): StabilityTrackerEventDto => {
  const dto = {
    timestamp: streamEvent.timestamp,
    stimPos: streamEvent.circlePosition,
    targetPos: streamEvent.targetPosition,
    userPos: streamEvent.userPosition,
    score: streamEvent.score,
    lambda: streamEvent.lambda,
    lambdaSlope: streamEvent.lambdaSlope,
  };

  return dto;
};

type MappingFlankerStreamEventToDtoOptions = {
  isAndroid: boolean;
};

const mapFlankerStreamEventToDto = (
  streamEvent: FlankerLiveEvent,
  options: MappingFlankerStreamEventToDtoOptions,
) => {
  if (options.isAndroid) {
    let screenCountPerTrial = 1;

    if (streamEvent.showFeedback) {
      screenCountPerTrial++;
    }
    if (streamEvent.showFixation) {
      screenCountPerTrial++;
    }

    const dto = {
      trial_index: Math.ceil(
        (streamEvent.trialIndex + 1) / screenCountPerTrial,
      ),
      duration: streamEvent.duration,
      question: streamEvent.question,
      button_pressed: streamEvent.buttonPressed,
      start_time: streamEvent.imageTime,
      correct: streamEvent.correct,
      start_timestamp: streamEvent.startTimestamp,
      offset: streamEvent.startTimestamp - streamEvent.startTime,
      tag: streamEvent.tag,
      response_touch_timestamp: streamEvent.duration
        ? streamEvent.startTimestamp + streamEvent.duration
        : null,
    };

    return dto;
  }

  const dto = {
    trial_index: streamEvent.trialIndex,
    duration: streamEvent.duration,
    question: streamEvent.question,
    correct: streamEvent.correct,
    response_touch_timestamp: streamEvent.responseTouchTimeStamp,
    tag: streamEvent.tag,
    start_time: streamEvent.startTime,
    start_timestamp: streamEvent.startTimestamp,
    offset: 0,
    button_pressed: streamEvent.buttonPressed,
  };

  return dto;
};

type MapStreamEventToDtoOptions = {
  isAndroid?: boolean;
};

export const mapStreamEventToDto = (
  streamEvent: LiveEvent,
  options?: MapStreamEventToDtoOptions,
): LiveEventDto => {
  const type = streamEvent.type;
  let isAndroid = options?.isAndroid;
  if (isAndroid === null || isAndroid === undefined) {
    isAndroid = IS_ANDROID;
  }

  switch (type) {
    case 'AbTest':
      return mapABTestStreamEventToDto(streamEvent);
    case 'DrawingTest':
      return mapDrawingStreamEventToDto(streamEvent);
    case 'Flanker':
      return mapFlankerStreamEventToDto(streamEvent, { isAndroid });
    case 'StabilityTracker':
      return mapStabilityTrackerStreamEventToDto(streamEvent);
    default:
      return streamEvent;
  }
};
