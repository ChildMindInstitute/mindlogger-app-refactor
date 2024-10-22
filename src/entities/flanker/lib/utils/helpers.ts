import { FlankerItemSettings } from '@app/abstract/lib/types/flanker';

import { FlankerLogRecord, FlankerWebViewLogRecord } from '../types/response';

export const parseResponse = (data: {
  record: FlankerWebViewLogRecord;
  numberOfScreensPerTrial?: number;
  isWebView: boolean;
}): FlankerLogRecord => {
  const { record, numberOfScreensPerTrial, isWebView } = data;

  const parseResponseResult: FlankerLogRecord = {
    trialIndex: !isWebView
      ? record.trial_index
      : Math.ceil((record.trial_index + 1) / numberOfScreensPerTrial!),
    duration: record.rt,
    question: record.stimulus,
    buttonPressed: record.button_pressed,
    startTime: !isWebView ? record.start_time : record.image_time,
    correct: record.correct,
    startTimestamp: !isWebView ? record.image_time : record.start_timestamp,
    offset: !isWebView ? 0 : record.start_timestamp - record.start_time,
    tag: record.tag,
    responseTouchTimestamp: !isWebView
      ? record.response_touch_timestamp
      : record.rt
        ? record.start_timestamp + record.rt
        : null,
  };

  return parseResponseResult;
};

export const getScreensNumberPerTrial = (
  configuration: FlankerItemSettings,
): number => {
  let result = 1;

  if (configuration.showFeedback) {
    result++;
  }
  if (configuration.showFixation) {
    result++;
  }
  return result;
};
