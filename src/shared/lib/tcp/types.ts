export type FlankerLiveEvent = {
  trial_index: number;
  duration: number;
  question: string;
  correct: boolean;
  response_touch_timestamp: number | null;
  tag: string;
  start_time: number;
  start_timestamp: number;
  offset: number;
  button_pressed: string;
};

export type StreamEventLoggable<T> = {
  onLog: (event: T) => void;
};
