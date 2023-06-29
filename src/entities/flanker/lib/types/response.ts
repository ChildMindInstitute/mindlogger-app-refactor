export type BlockType = 'test' | 'practice';

// we cannot avoid "_" here, because it's web-view, ios-swift-components contracts
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

export type FlankerNativeIosLogRecord = FlankerWebViewLogRecord;

export type FlankerGameResponse = {
  records: Array<FlankerLogRecord>;
  gameType: BlockType;
};

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
