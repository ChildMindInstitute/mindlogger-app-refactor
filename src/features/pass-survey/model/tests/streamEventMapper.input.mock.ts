import {
  AbTestStreamEventErrorType,
  LiveEvent,
  LiveEventDto,
} from '@shared/lib';

export const abTrailsInput: LiveEvent = {
  x: 1,
  y: 1,
  time: 1111,
  lineNumber: 2,
  error: AbTestStreamEventErrorType.OverCorrectPoint,
  currentNodeLabel: 'A',
  nextNodeLabel: 'B',
  wrongPointLabel: 'C',
  type: 'AbTest',
};

export const abTrailsWrongInput: LiveEvent = {
  x: 1,
  y: 1,
  time: 1111,
  lineNumber: 2,
  error: AbTestStreamEventErrorType.OverUndefinedPoint,
  currentNodeLabel: 'A',
  nextNodeLabel: 'B',
  wrongPointLabel: 'C',
  type: 'AbTest',
};

export const abTrailsWrongOutput: LiveEventDto = {
  actual_path: '-1',
  correct_path: 'A ~ B',
  error: AbTestStreamEventErrorType.OverUndefinedPoint,
  line_number: 2,
  time: 1111,
  x: 1,
  y: 1,
};

export const abTrailsOutput: LiveEventDto = {
  actual_path: 'B',
  correct_path: 'A ~ B',
  error: AbTestStreamEventErrorType.OverCorrectPoint,
  line_number: 2,
  time: 1111,
  x: 1,
  y: 1,
};

export const drawingInput: LiveEvent = {
  type: 'DrawingTest',
  lineNumber: 2,
  time: 1111,
  x: 1,
  y: 1,
};

export const drawingOutput: LiveEventDto = {
  line_number: 2,
  time: 1111,
  x: 1,
  y: 1,
};

export const CSTInput: LiveEvent = {
  type: 'StabilityTracker',
  timestamp: 1111,
  circlePosition: [1],
  targetPosition: [2],
  userPosition: [3],
  score: 4,
  lambda: 50,
  lambdaSlope: 0.5,
};

export const CSTOutput: LiveEventDto = {
  timestamp: 1111,
  stimPos: [1],
  targetPos: [2],
  userPos: [3],
  score: 4,
  lambda: 50,
  lambdaSlope: 0.5,
};

export const FlankerAndroidInput: LiveEvent = {
  type: 'Flanker',
  duration: 100,
  startTimestamp: 1111,
  tag: 'some tag',
  startTime: 2222,
  correct: false,
  imageTime: 3333,
  buttonPressed: '1111',
  question: 'Some question?',
  trialIndex: 1,
  showFeedback: true,
  showFixation: true,
};

export const FlankerAndroidInputWithEmptyDurationInput: LiveEvent = {
  type: 'Flanker',
  duration: 0,
  startTimestamp: 1111,
  tag: 'some tag',
  startTime: 2222,
  correct: false,
  imageTime: 3333,
  buttonPressed: '1111',
  question: 'Some question?',
  trialIndex: 1,
  showFeedback: true,
  showFixation: true,
};

export const FlankerAndroidInputWithEmptyDurationOutput: LiveEventDto = {
  button_pressed: '1111',
  correct: false,
  duration: 0,
  offset: -1111,
  question: 'Some question?',
  response_touch_timestamp: null,
  start_time: 3333,
  start_timestamp: 1111,
  tag: 'some tag',
  trial_index: 1,
};
export const FlankerAndroidOutput: LiveEventDto = {
  button_pressed: '1111',
  correct: false,
  duration: 100,
  offset: -1111,
  question: 'Some question?',
  start_time: 3333,
  response_touch_timestamp: 1211,
  start_timestamp: 1111,
  tag: 'some tag',
  trial_index: 1,
};

export const FlankerIOSInput: LiveEvent = {
  type: 'Flanker',
  duration: 100,
  startTimestamp: 1111,
  tag: 'some tag',
  startTime: 2222,
  correct: false,
  responseTouchTimeStamp: 3333,
  buttonPressed: '1111',
  question: 'Some question?',
  trialIndex: 1,
  showFeedback: true,
  showFixation: true,
};

export const FlankerIOSOutput: LiveEventDto = {
  button_pressed: '1111',
  correct: false,
  duration: 100,
  offset: 0,
  question: 'Some question?',
  response_touch_timestamp: 3333,
  start_time: 2222,
  start_timestamp: 1111,
  tag: 'some tag',
  trial_index: 1,
};
