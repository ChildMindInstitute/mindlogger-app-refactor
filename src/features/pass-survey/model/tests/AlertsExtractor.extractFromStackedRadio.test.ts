import { ILogger } from '@app/shared/lib';

import { getStackedRadioItem, getStackedRadioResponse } from './testHelpers';
import { AnswerAlerts, StackedRadioResponse } from '../../lib';
import { AlertsExtractor } from '../AlertsExtractor';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

describe('AlertsExtractor: test extractFromStackedRadio', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);
  });

  it('Should return two alerts from the two selected cells in different rows', () => {
    const radiosItem = getStackedRadioItem();

    const radioAnswer: StackedRadioResponse =
      getStackedRadioResponse('1-no-empty-alerts');

    const result: AnswerAlerts = extractor.extractFromStackedRadio(radiosItem, {
      answer: radioAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-item-stacked-radio-id',
        message: 'mock-alert-r1-o1',
      },
      {
        activityItemId: 'mock-item-stacked-radio-id',
        message: 'mock-alert-r2-o2',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return a single alert from the two selected cells in different rows', () => {
    const radiosItem = getStackedRadioItem();

    const radioAnswer: StackedRadioResponse =
      getStackedRadioResponse('2-is-empty-alert');

    const result: AnswerAlerts = extractor.extractFromStackedRadio(radiosItem, {
      answer: radioAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-item-stacked-radio-id',
        message: 'mock-alert-r1-o1',
      },
    ];

    expect(result).toEqual(expected);
  });
});
