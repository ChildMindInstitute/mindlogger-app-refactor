// we cannot avoid _ format here as it's web-view contract
export type FlankerWebViewLogRecord = {
  button_pressed: string;
  correct: boolean;
  image_time: number;
  response_touch_timestamp: number;
  rt: number;
  start_time: number;
  start_timestamp: 0;
  stimulus: string;
  tag: string;
  trial_index: number;
};

/*
  Discuss with BE if we can avoid such names in dto:
  button_pressed
  response_touch_timestamp
  start_time
  start_timestamp
  trial_index
*/
export type FlankerLogRecord = {
  buttonPressed: string;
  correct: boolean;
  duration: number;
  offset: number;
  question: string;
  responseTouchTimestamp: number | null;
  startTime: number;
  startTimestamp: number;
  tag: string;
  trialIndex: number;
};
