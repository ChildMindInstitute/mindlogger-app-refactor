import {
  AbTestStreamEventDto,
  AbTestStreamEventErrorType,
  AbTestStreamEvent,
  StreamEventActivityItemType,
  DrawingStreamEvent,
  DrawingStreamEventDto,
  StabilityTrackerEvent,
  StabilityTrackerEventDto,
  LiveEvent,
} from '../types';

const mapABTestStreamEventToDto = (
  streamEvent: AbTestStreamEvent,
): AbTestStreamEventDto => {
  let actualPath = '-1';
  if (streamEvent.wrongPointLabel) {
    actualPath = streamEvent.wrongPointLabel;
  }
  if (streamEvent.error === AbTestStreamEventErrorType.OverCorrectPoint) {
    actualPath = `${streamEvent.currentNodeLabel} ~ ${streamEvent.nextNodeLabel}`;
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

export const mapStreamEventToDto = (
  type: StreamEventActivityItemType,
  streamEvent: LiveEvent,
) => {
  switch (type) {
    case 'AbTest':
      return mapABTestStreamEventToDto(streamEvent as AbTestStreamEvent);
    case 'DrawingTest':
      return mapDrawingStreamEventToDto(streamEvent as DrawingStreamEvent);
    case 'StabilityTracker':
      return mapStabilityTrackerStreamEventToDto(
        streamEvent as StabilityTrackerEvent,
      );
    default:
      return streamEvent;
  }
};
