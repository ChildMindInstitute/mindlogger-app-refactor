export const enum MessageType {
  NotDefined = 0,
  IncorrectStartPoint = 1,
  IncorrectLine = 2,
  Completed = 3,
}

export const MessageTypeStrings = {
  [MessageType.NotDefined]: 'NotDefined',
  [MessageType.IncorrectStartPoint]: 'Incorrect start point!',
  [MessageType.IncorrectLine]: 'Incorrect line!',
  [MessageType.Completed]: '',
};

export type LogPoint = {
  x: number;
  y: number;
  start: string;
  end: string;
  time: number;
  valid: boolean | null;
  actual: string | null;
};

export type LogLine = { points: Array<LogPoint> };

export type OnResultLog = {
  lines: LogLine[];
  currentIndex: number;
};

export const enum StreamEventError {
  NotDefined = '?',
  OVER_RIGHT_POINT = 'E0',
  OVER_WRONG_POINT = 'E1',
  OVER_UNDEFINED_POINT = 'E2',
}
export type StreamEventPoint = {
  x: number;
  y: number;
  time: number;
  line_number: number;
  error: StreamEventError;
  correct_path: string;
  actual_path: string;
};

export type AbTestResult = {
  width: number;
  startTime: number;
  updated: true;
} & OnResultLog;
