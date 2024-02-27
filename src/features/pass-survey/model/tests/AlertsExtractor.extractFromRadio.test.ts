import { ILogger } from '@app/shared/lib';

import { fillOptionsForRadio, getEmptyRadioItem } from './testHelpers';
import { AnswerAlerts, RadioResponse } from '../../lib';
import { AlertsExtractor } from '../AlertsExtractor';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

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
        activityItemId: radiosItem.id!,
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
