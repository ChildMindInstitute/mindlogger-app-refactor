import { ILogger } from '@app/shared/lib/types/logger';

import {
  getStackedCheckboxItem,
  getStackedCheckboxResponse,
} from './testHelpers';
import { StackedCheckboxResponse } from '../../lib/types/payload';
import { AnswerAlerts } from '../../lib/types/summary';
import { AlertsExtractor } from '../AlertsExtractor';

describe('AlertsExtractor: test extractFromStackedCheckbox', () => {
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
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r1-o1',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r1-o2',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r2-o2',
      },
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
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r1-o1',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r1-o2',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r1-o3',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r2-o1',
      },
      {
        activityItemId: 'mock-item-stacked-checkbox-id',
        message: 'mock-alert-r2-o2',
      },
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
