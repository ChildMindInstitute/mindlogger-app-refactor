import { FlankerLogRecord, FlankerWebViewLogRecord } from '../types';

export const parseResponse = (data: {
  record: FlankerWebViewLogRecord;
  numberOfScreensPerTrial: number;
  isWebView: boolean;
}): FlankerLogRecord => {
  const { record, numberOfScreensPerTrial, isWebView } = data;

  const parseResponseResult: FlankerLogRecord = {
    trial_index: !isWebView
      ? record.trial_index
      : Math.ceil((record.trial_index + 1) / numberOfScreensPerTrial),
    duration: record.rt,
    question: record.stimulus,
    button_pressed: record.button_pressed,
    start_time: !isWebView ? record.start_time : record.image_time,
    correct: record.correct,
    start_timestamp: !isWebView ? record.image_time : record.start_timestamp,
    offset: !isWebView ? 0 : record.start_timestamp - record.start_time,
    tag: record.tag,
    response_touch_timestamp: !isWebView
      ? record.response_touch_timestamp
      : record.rt
      ? record.start_timestamp + record.rt
      : null,
  };

  return parseResponseResult;
};
