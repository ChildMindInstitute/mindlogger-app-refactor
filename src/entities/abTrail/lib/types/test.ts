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
  maximumIndex: number;
};

export type AbTestResult = {
  width: number;
  startTime: number;
  updated: true;
} & OnResultLog;
