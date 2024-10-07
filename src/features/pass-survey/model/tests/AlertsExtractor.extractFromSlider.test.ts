import { ILogger } from '@app/shared/lib/types/logger';

import { fillAlertsForSlider, getEmptySliderItem } from './testHelpers';
import { SliderResponse } from '../../lib/types/payload';
import { AnswerAlerts } from '../../lib/types/summary';
import { AlertsExtractor } from '../AlertsExtractor';

describe('AlertsExtractor: test extractFromSlider', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);
  });

  it('Should return alert when slider value is equal to min-value', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 2;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-slider-id',
        message: 'mock-alert-2',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return alert when slider value is equal to max-value', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 9;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-slider-id',
        message: 'mock-alert-9',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return alert when slider value is equal to any value between min-max', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 3;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-slider-id',
        message: 'mock-alert-3',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('Should return empty array when slider value is equal to any between min-max and alert is not set for that value', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 4;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });

  it('Should return empty array when slider value is less than min-value', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 1;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });

  it('Should return empty array when slider value is more than max-value', () => {
    const sliderItem = getEmptySliderItem('item-slider');

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 10;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [];

    expect(result).toEqual(expected);
  });

  it('Should return alert when slider is continuous', () => {
    const sliderItem = getEmptySliderItem('item-slider');
    sliderItem.payload.isContinuousSlider = true;

    fillAlertsForSlider(sliderItem);

    const sliderAnswer: SliderResponse = 7.5;

    const result: AnswerAlerts = extractor.extractFromSlider(sliderItem, {
      answer: sliderAnswer,
    });

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-slider-id',
        message: 'mock-alert-7-8',
      },
    ];

    expect(result).toEqual(expected);
  });
});
