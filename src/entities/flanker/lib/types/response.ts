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

export type FlankerLogRecord = {
  button_pressed: string;
  correct: boolean;
  duration: number;
  offset: number;
  question: string;
  response_touch_timestamp: number | null;
  start_time: number;
  start_timestamp: number;
  tag: string;
  trial_index: number;
};
