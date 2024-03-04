import { ILogger } from '@app/shared/lib';

import {
  getStackedCheckboxItem,
  getStackedCheckboxResponse,
} from './testHelpers';
import { AnswerAlerts, StackedCheckboxResponse } from '../../lib';
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

  it('Should return three alerts from the four selected cells in different rows', () => {
    const checkboxesItem = getStackedCheckboxItem();

    const checkboxesAnswer: StackedCheckboxResponse =
      getStackedCheckboxResponse('1-partially-selected');

    const result: AnswerAlerts = extractor.extractFromStackedCheckbox(
      checkboxesItem,
      {
        answer: checkboxesAnswer,
      },
    );

    const expected: AnswerAlerts = [
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r1-o1' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r1-o2' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r2-o2' },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return all five alerts from the all six selected cells in different rows', () => {
    const checkboxesItem = getStackedCheckboxItem();

    const checkboxesAnswer: StackedCheckboxResponse =
      getStackedCheckboxResponse('2-all-selected');

    const result: AnswerAlerts = extractor.extractFromStackedCheckbox(
      checkboxesItem,
      {
        answer: checkboxesAnswer,
      },
    );

    const expected: AnswerAlerts = [
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r1-o1' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r1-o2' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r1-o3' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r2-o1' },
      { activityItemId: 'item-stacked-checkbox', message: 'mock-alert-r2-o2' },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return empty alerts array when nothing selected', () => {
    const checkboxesItem = getStackedCheckboxItem();

    const checkboxesAnswer: StackedCheckboxResponse =
      getStackedCheckboxResponse('3-no-selection');

    const result: AnswerAlerts = extractor.extractFromStackedCheckbox(
      checkboxesItem,
      {
        answer: checkboxesAnswer,
      },
    );

    expect(result).toEqual([]);
  });

  it('Should return empty alerts array when answer sub-object is undefined', () => {
    const checkboxesItem = getStackedCheckboxItem();

    const result: AnswerAlerts = extractor.extractFromStackedCheckbox(
      checkboxesItem,
      {
        answer: undefined,
      },
    );

    expect(result).toEqual([]);
  });
});
