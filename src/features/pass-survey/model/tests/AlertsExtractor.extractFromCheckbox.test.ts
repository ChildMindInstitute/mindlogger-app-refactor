import { ILogger } from '@app/shared/lib/types/logger';
import { Item } from '@app/shared/ui/survey/CheckBox/types';

import {
  fillOptionsForCheckboxes,
  getEmptyCheckboxesItem,
} from './testHelpers';
import { AnswerAlerts } from '../../lib/types/summary';
import { AlertsExtractor } from '../AlertsExtractor';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

describe('AlertsExtractor: test extractFromCheckbox', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);
  });

  it('Should return two alerts from the selected items when alerts are set in both', () => {
    const checkboxesItem = getEmptyCheckboxesItem('item-checkboxes');
    fillOptionsForCheckboxes(checkboxesItem, 0);

    const checkboxesAnswer: Item[] = [
      checkboxesItem.payload.options[1],
      checkboxesItem.payload.options[2],
    ];

    const result: AnswerAlerts = extractor.extractFromCheckbox(checkboxesItem, {
      answer: checkboxesAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-checkbox-id',
        message: 'mock-alert-1',
      },
      {
        activityItemId: 'mock-checkbox-id',
        message: 'mock-alert-2',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return a single alert from the selected items when alert is set in one of two', () => {
    const checkboxesItem = getEmptyCheckboxesItem('item-checkboxes');
    fillOptionsForCheckboxes(checkboxesItem, 0);

    const checkboxesAnswer: Item[] = [
      checkboxesItem.payload.options[1],
      checkboxesItem.payload.options[2],
    ];
    checkboxesItem.payload.options[2].alert = null;

    const result: AnswerAlerts = extractor.extractFromCheckbox(checkboxesItem, {
      answer: checkboxesAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-checkbox-id',
        message: 'mock-alert-1',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return empty array from the selected items when alerts are not set in both', () => {
    const checkboxesItem = getEmptyCheckboxesItem('item-checkboxes');
    fillOptionsForCheckboxes(checkboxesItem, 0, false);

    const checkboxesAnswer: Item[] = [
      checkboxesItem.payload.options[1],
      checkboxesItem.payload.options[2],
    ];

    const result: AnswerAlerts = extractor.extractFromCheckbox(checkboxesItem, {
      answer: checkboxesAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });

  it('Should return empty array when nothing selected', () => {
    const checkboxesItem = getEmptyCheckboxesItem('item-checkboxes');
    fillOptionsForCheckboxes(checkboxesItem, 0);

    const checkboxesAnswer: Item[] = [];

    const result: AnswerAlerts = extractor.extractFromCheckbox(checkboxesItem, {
      answer: checkboxesAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });
});
