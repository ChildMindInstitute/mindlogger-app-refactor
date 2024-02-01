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

export const enum StreamEventErrorType {
  NotDefined = '?',
  OverRightPoint = 'E0',
  OverWrongPoint = 'E1',
  OverUndefinedPoint = 'E2',
}

export type StreamEventPoint = {
  x: number;
  y: number;
  time: number;
  lineNumber: number;
  error: StreamEventErrorType;
  currentNodeLabel: string;
  nextNodeLabel: string;
  wrongPointLabel?: string;
};

export type StreamEventDto = {
  x: number;
  y: number;
  time: number;
  line_number: number;
  error: StreamEventErrorType;
  correct_path: string;
  actual_path: string;
};

export type AbTestResult = {
  width: number;
  startTime: number;
  updated: true;
} & OnResultLog;
