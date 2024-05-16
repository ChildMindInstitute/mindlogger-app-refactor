import { ILogger } from '@app/shared/lib';
import { Item } from '@app/shared/ui';

import {
  fillAlertsForSlider,
  fillOptionsForCheckboxes,
  fillOptionsForRadio,
  getEmptyCheckboxesItem,
  getEmptyRadioItem,
  getEmptySliderItem,
  getStackedCheckboxItem,
  getStackedCheckboxResponse,
  getStackedRadioItem,
  getStackedRadioResponse,
  getStackedSliderItem,
} from './testHelpers';
import {
  AnswerAlerts,
  Answers,
  PipelineItem,
  RadioResponse,
  SliderResponse,
  StackedCheckboxResponse,
  StackedRadioResponse,
  StackedSliderResponse,
} from '../../lib';
import { AlertsExtractor } from '../AlertsExtractor';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

describe('AlertsExtractor: penetration tests', () => {
  const extractor: AlertsExtractor = new AlertsExtractor({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  } as unknown as ILogger);

  it('Should return alerts for all 6 activity items', () => {
    const radiosItem = getEmptyRadioItem('item-radio');
    fillOptionsForRadio(radiosItem, 0);
    const radioAnswer: RadioResponse = radiosItem.payload.options[2];

    const checkboxesItem = getEmptyCheckboxesItem('item-checkboxes');
    fillOptionsForCheckboxes(checkboxesItem, 0);

    const checkboxesAnswer: Item[] = [
      checkboxesItem.payload.options[1],
      checkboxesItem.payload.options[2],
    ];

    const sliderItem = getEmptySliderItem('item-slider');
    fillAlertsForSlider(sliderItem);
    const sliderAnswer: SliderResponse = 2;

    const stackedRadiosItem = getStackedRadioItem();
    const stackedRadioAnswer: StackedRadioResponse =
      getStackedRadioResponse('1-no-empty-alerts');

    const stackedCheckboxesItem = getStackedCheckboxItem();
    const stackedCheckboxesAnswer: StackedCheckboxResponse =
      getStackedCheckboxResponse('1-partially-selected');

    const stackedSlidersItem = getStackedSliderItem();
    const stackedSliderAnswers: StackedSliderResponse = [5, 3];

    const answers: Answers = {
      0: { answer: radioAnswer },
      1: { answer: checkboxesAnswer },
      2: { answer: sliderAnswer },
      3: { answer: stackedRadioAnswer },
      4: { answer: stackedCheckboxesAnswer },
      5: { answer: stackedSliderAnswers },
    };

    const pipelineItems: PipelineItem[] = [
      radiosItem,
      checkboxesItem,
      sliderItem,
      stackedRadiosItem,
      stackedCheckboxesItem,
      stackedSlidersItem,
    ];

    const alerts = extractor.extractForSummary(
      pipelineItems,
      answers,
      'mock-activity-name',
    );

    const expected: AnswerAlerts = [
      {
        activityItemId: 'mock-radio-id',
        message: 'mock-alert-2',
      },
      {
        activityItemId: 'mock-checkbox-id',
        message: 'mock-alert-1',
      },
      {
        activityItemId: 'mock-checkbox-id',
        message: 'mock-alert-2',
      },
      {
        activityItemId: 'mock-slider-id',
        message: 'mock-alert-2',
      },
      {
        activityItemId: 'mock-item-stacked-radio-id',
        message: 'mock-alert-r1-o1',
      },
      {
        activityItemId: 'mock-item-stacked-radio-id',
        message: 'mock-alert-r2-o2',
      },
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
      {
        activityItemId: 'mock-stacked-slider-id',
        message: 'mock-row1-5-alert',
      },
      {
        activityItemId: 'mock-stacked-slider-id',
        message: 'mock-row2-3-alert',
      },
    ];

    expect(alerts).toEqual(expected);
  });
});
