import { ILogger } from '@app/shared/lib/types/logger';

import { fillOptionsForRadio, getEmptyRadioItem } from './testHelpers';
import { RadioResponse } from '../../lib/types/payload';
import { AnswerAlerts } from '../../lib/types/summary';
import { AlertsExtractor } from '../AlertsExtractor';

describe('AlertsExtractor: test extractFromRadio', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);
  });

  it('Should return alert from the selected item when alert is set', () => {
    const radiosItem = getEmptyRadioItem('item-radio');
    fillOptionsForRadio(radiosItem, 0);

    const radioAnswer: RadioResponse = radiosItem.payload.options[2];

    const result: AnswerAlerts = extractor.extractFromRadio(radiosItem, {
      answer: radioAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-radio-id',
        message: 'mock-alert-2',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return empty array when alert is not set', () => {
    const radiosItem = getEmptyRadioItem('item-radio');
    fillOptionsForRadio(radiosItem, 1, false);

    const radioAnswer: RadioResponse = radiosItem.payload.options[2];

    const result: AnswerAlerts = extractor.extractFromRadio(radiosItem, {
      answer: radioAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });
});
