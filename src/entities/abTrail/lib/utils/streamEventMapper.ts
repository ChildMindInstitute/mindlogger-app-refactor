import {
  StreamEventDto,
  StreamEventErrorType,
  StreamEventPoint,
} from '@entities/abTrail';

export const mapStreamEventToDto = (
  streamEvent: StreamEventPoint,
): StreamEventDto => {
  let actualPath = '-1';
  if (streamEvent.wrongPointLabel) {
    actualPath = streamEvent.wrongPointLabel;
  }
  if (streamEvent.error === StreamEventErrorType.OverRightPoint) {
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
