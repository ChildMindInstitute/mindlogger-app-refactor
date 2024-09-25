import { DrawPoint } from '@app/entities/drawer/lib/types/draw';

export type FlankerLiveEvent = {
  trialIndex: number;
  duration: number;
  question: string;
  buttonPressed: string;
  imageTime?: number;
  correct: boolean;
  tag: string;
  startTime: number;
  startTimestamp: number;
  offset?: number;
  responseTouchTimeStamp?: number;
  showFixation?: boolean;
  showFeedback?: boolean;
  type: 'Flanker';
};

export type FlankerLiveEventDto = {
  trial_index: number;
  duration: number;
  question: string;
  correct: boolean;
  response_touch_timestamp?: number | null;
  tag: string;
  start_time?: number;
  start_timestamp: number;
  offset: number;
  button_pressed: string;
};

export type StreamEventLoggable<T> = {
  onLog: (event: T) => void;
};

export type LiveEvent =
  | AbTestStreamEvent
  | DrawingStreamEvent
  | StabilityTrackerEvent
  | FlankerLiveEvent;

export type StabilityTrackerEventDto = {
  timestamp: number;
  stimPos: number[];
  userPos: number[];
  targetPos: number[];
  lambda: number;
  score: number;
  lambdaSlope: number;
};

export type StabilityTrackerEvent = {
  timestamp: number;
  circlePosition: number[];
  userPosition: number[];
  targetPosition: number[];
  lambda: number;
  score: number;
  lambdaSlope: number;
  type: 'StabilityTracker';
};

export type DrawingStreamEvent = DrawPoint & {
  lineNumber: number;
  type: 'DrawingTest';
};

export type DrawingStreamEventDto = DrawPoint & { line_number: number };

export const enum AbTestStreamEventErrorType {
  NotDefined = '?',
  OverCorrectPoint = 'E0',
  OverWrongPoint = 'E1',
  OverUndefinedPoint = 'E2',
}

export type AbTestStreamEvent = {
  x: number;
  y: number;
  time: number;
  lineNumber: number;
  error: AbTestStreamEventErrorType;
  currentNodeLabel: string;
  nextNodeLabel: string;
  wrongPointLabel?: string;
  type: 'AbTest';
};

export type AbTestStreamEventDto = {
  x: number;
  y: number;
  time: number;
  line_number: number;
  error: AbTestStreamEventErrorType;
  correct_path: string;
  actual_path: string;
};

export type LiveEventDto =
  | AbTestStreamEventDto
  | DrawingStreamEventDto
  | FlankerLiveEventDto
  | StabilityTrackerEventDto;
