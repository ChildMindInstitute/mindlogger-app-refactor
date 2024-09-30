import { ILogger } from '@app/shared/lib/types/logger';

import { getStackedSliderItem } from './testHelpers';
import { StackedSliderResponse } from '../../lib/types/payload';
import { AnswerAlerts } from '../../lib/types/summary';
import { AlertsExtractor } from '../AlertsExtractor';

describe('AlertsExtractor: test extractFromStackedSlider', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);
  });

  const tests = [
    {
      firstValue: 5,
      secondValue: 3,
      firstAlert: 'mock-row1-5-alert',
      secondAlert: 'mock-row2-3-alert',
    },
    {
      firstValue: 2,
      secondValue: 1,
      firstAlert: 'mock-row1-2-alert',
      secondAlert: undefined,
    },
    {
      firstValue: 9,
      secondValue: 5,
      firstAlert: 'mock-row1-9-alert',
      secondAlert: undefined,
    },
  ];

  tests.forEach(({ firstValue, secondValue, firstAlert, secondAlert }) => {
    const secondAlertSubstring =
      secondAlert !== undefined ? ', ' + secondAlert : '';

    it(`Should return alerts '${firstAlert}'${secondAlertSubstring} when values are ${firstValue} and ${secondValue} on the 1st and 2nd slider correspondingly`, () => {
      const slidersItem = getStackedSliderItem();

      const sliderAnswers: StackedSliderResponse = [firstValue, secondValue];

      const result: AnswerAlerts = extractor.extractFromStackedSlider(
        slidersItem,
        {
          answer: sliderAnswers,
        },
      );

      const expected: AnswerAlerts = [
        {
          activityItemId: 'mock-stacked-slider-id',
          message: firstAlert,
        },
      ];

      if (secondAlert !== undefined) {
        expected.push({
          activityItemId: 'mock-stacked-slider-id',
          message: secondAlert,
        });
      }

      expect(result).toEqual(expected);
    });
  });

  it('Should return empty alerts array when values are 3 and 4 on the 1st and 2nd slider correspondingly and there is no any set alert', () => {
    const slidersItem = getStackedSliderItem();

    const sliderAnswers: StackedSliderResponse = [3, 4];

    const result: AnswerAlerts = extractor.extractFromStackedSlider(
      slidersItem,
      {
        answer: sliderAnswers,
      },
    );

    expect(result).toEqual([]);
  });

  it('Should return empty alerts array when values are 1 and 2 on the 1st and 2nd slider correspondingly and alerts set to null in the both rows', () => {
    const slidersItem = getStackedSliderItem();
    slidersItem.payload.rows[0].alerts = null;
    slidersItem.payload.rows[1].alerts = null;

    const sliderAnswers: StackedSliderResponse = [1, 2];

    const result: AnswerAlerts = extractor.extractFromStackedSlider(
      slidersItem,
      {
        answer: sliderAnswers,
      },
    );

    expect(result).toEqual([]);
  });
});
