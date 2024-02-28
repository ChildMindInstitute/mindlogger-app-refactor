import { CalculationType, Report } from '@app/entities/activity';
import { ILogger } from '@app/shared/lib';
import { Item } from '@app/shared/ui';

import {
  Answers,
  CheckboxPipelineItem,
  PipelineItem,
  RadioPipelineItem,
  RadioResponse,
  ScoreRecord,
  SliderPipelineItem,
  SliderResponse,
} from '../../lib';
import { ScoreConditionsEvaluator } from '../ScoreConditionsEvaluator';
import { ScoresCalculator } from '../ScoresCalculator';
import { ScoresExtractor } from '../ScoresExtractor';

const getRadiosItem = (): RadioPipelineItem => {
  const radiosItem: RadioPipelineItem = {
    type: 'Radio',
    timer: null,
    name: 'item-radio',
    payload: {
      addTooltip: false,
      autoAdvance: false,
      setPalette: false,
      setAlerts: false,
      randomizeOptions: false,
      options: [
        {
          alert: null,
          color: null,
          id: 'mock-item-id-1',
          image: null,
          isHidden: false,
          score: 10,
          text: 'mock-item-text-1',
          tooltip: null,
          value: 0,
        },
        {
          alert: null,
          color: null,
          id: 'mock-item-id-1',
          image: null,
          isHidden: false,
          score: 20,
          text: 'mock-item-text-1',
          tooltip: null,
          value: 1,
        },
        {
          alert: null,
          color: null,
          id: 'mock-item-id-1',
          image: null,
          isHidden: false,
          score: 30,
          text: 'mock-item-text-1',
          tooltip: null,
          value: 3,
        },
      ],
    },
  };
  return radiosItem;
};

const getCheckboxesItem = (): CheckboxPipelineItem => {
  const checkboxesItem: CheckboxPipelineItem = {
    type: 'Checkbox',
    timer: null,
    name: 'item-checkboxes',
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [
        {
          alert: null,
          color: null,
          id: 'mock-item-id-100',
          image: null,
          isHidden: false,
          score: 100,
          text: 'mock-text-100',
          tooltip: null,
          value: 0,
        },
        {
          alert: null,
          color: null,
          id: 'mock-item-id-200',
          image: null,
          isHidden: false,
          score: 200,
          text: 'mock-text-200',
          tooltip: null,
          value: 1,
        },
        {
          alert: null,
          color: null,
          id: 'mock-item-id-300',
          image: null,
          isHidden: false,
          score: 300,
          text: 'mock-text-300',
          tooltip: null,
          value: 1,
        },
      ],
    },
  };
  return checkboxesItem;
};

const getSliderItem = (): SliderPipelineItem => {
  const sliderItem: SliderPipelineItem = {
    type: 'Slider',
    timer: null,
    name: 'item-slider',
    payload: {
      alerts: [],
      isContinuousSlider: false,
      leftImageUrl: null,
      rightImageUrl: null,
      leftTitle: null,
      rightTitle: null,
      minValue: 5,
      maxValue: 10,
      scores: [5, 6, 7, 8, 9, 10],
      showTickLabels: false,
      showTickMarks: false,
    },
  };
  return sliderItem;
};

describe('ScoresCalculator: test collectScoreForRadio', () => {
  let extractor: ScoresExtractor;

  beforeEach(() => {
    extractor = new ScoresExtractor(
      new ScoreConditionsEvaluator(),
      new ScoresCalculator(),
      {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
      } as unknown as ILogger,
    );
  });

  [
    { expectedValue: 517, calculationType: 'sum' },
    { expectedValue: 517 / 3, calculationType: 'average' },
    { expectedValue: 80.78125, calculationType: 'percentage' },
  ].forEach(({ expectedValue, calculationType }) => {
    it(`Should return ${expectedValue} when calculationType is ${calculationType} and no set conditions`, () => {
      const pipelineItems: PipelineItem[] = [];

      const radiosItem: PipelineItem = getRadiosItem();

      const checkBoxesItem: PipelineItem = getCheckboxesItem();

      const sliderItem: PipelineItem = getSliderItem();

      pipelineItems.push(radiosItem);
      pipelineItems.push(checkBoxesItem);
      pipelineItems.push(sliderItem);

      const radioAnswer: RadioResponse = radiosItem.payload.options[0];

      const checkBoxAnswer: Item[] = [
        checkBoxesItem.payload.options[1],
        checkBoxesItem.payload.options[2],
      ];

      const sliderAnswer: SliderResponse = 7;

      const answers: Answers = {
        0: { answer: radioAnswer },
        1: {
          answer: checkBoxAnswer,
        },
        2: { answer: sliderAnswer },
      };

      const reportSettings: Report[] = [
        {
          calculationType: calculationType as CalculationType,
          conditionalLogic: [],
          id: 'mock-report-id-1',
          includedItems: [
            radiosItem.name!,
            checkBoxesItem.name!,
            sliderItem.name!,
          ],
          name: 'mock-report-name-1',
          type: 'score',
        },
      ];

      const result: ScoreRecord[] = extractor.extract(
        pipelineItems,
        answers,
        reportSettings,
        'mock-log-activity-name-1',
      );

      const expected: ScoreRecord[] = [
        { flagged: false, name: 'mock-report-name-1', value: expectedValue },
      ];

      expect(result).toEqual(expected);
    });
  });

  it("Should return [517, 517 / 3, 80.78125] when calculationTypes are ['sum', 'average', percentage'] and no set conditions", () => {
    const pipelineItems: PipelineItem[] = [];

    const radiosItem: PipelineItem = getRadiosItem();

    const checkBoxesItem: PipelineItem = getCheckboxesItem();

    const sliderItem: PipelineItem = getSliderItem();

    pipelineItems.push(radiosItem);
    pipelineItems.push(checkBoxesItem);
    pipelineItems.push(sliderItem);

    const radioAnswer: RadioResponse = radiosItem.payload.options[0];

    const checkBoxAnswer: Item[] = [
      checkBoxesItem.payload.options[1],
      checkBoxesItem.payload.options[2],
    ];

    const sliderAnswer: SliderResponse = 7;

    const answers: Answers = {
      0: { answer: radioAnswer },
      1: {
        answer: checkBoxAnswer,
      },
      2: { answer: sliderAnswer },
    };

    const reportSettings: Report[] = [
      {
        calculationType: 'sum',
        conditionalLogic: [],
        id: 'mock-report-id-1',
        includedItems: [
          radiosItem.name!,
          checkBoxesItem.name!,
          sliderItem.name!,
        ],
        name: 'mock-report-name-1',
        type: 'score',
      },
      {
        calculationType: 'average',
        conditionalLogic: [],
        id: 'mock-report-id-1',
        includedItems: [
          radiosItem.name!,
          checkBoxesItem.name!,
          sliderItem.name!,
        ],
        name: 'mock-report-name-2',
        type: 'score',
      },
      {
        calculationType: 'percentage',
        conditionalLogic: [],
        id: 'mock-report-id-1',
        includedItems: [
          radiosItem.name!,
          checkBoxesItem.name!,
          sliderItem.name!,
        ],
        name: 'mock-report-name-3',
        type: 'score',
      },
    ];

    const result: ScoreRecord[] = extractor.extract(
      pipelineItems,
      answers,
      reportSettings,
      'mock-log-activity-name-1',
    );

    const expected: ScoreRecord[] = [
      { flagged: false, name: 'mock-report-name-1', value: 517 },
      { flagged: false, name: 'mock-report-name-2', value: 517 / 3 },
      { flagged: false, name: 'mock-report-name-3', value: 80.78125 },
    ];

    expect(result).toEqual(expected);
  });

  [
    {
      expectedValue: 510,
      calculationType: 'sum',
      selectedItems: ['item-radio', 'item-checkboxes'],
    },
    {
      expectedValue: 510,
      calculationType: 'sum',
      selectedItems: ['item-checkboxes', 'item-radio'],
    },
    {
      expectedValue: 507,
      calculationType: 'sum',
      selectedItems: ['item-checkboxes', 'item-slider'],
    },
    {
      expectedValue: 17,
      calculationType: 'sum',
      selectedItems: ['item-radio', 'item-slider'],
    },
    {
      expectedValue: 255,
      calculationType: 'average',
      selectedItems: ['item-radio', 'item-checkboxes'],
    },
    {
      expectedValue: 83.11475409836065,
      calculationType: 'percentage',
      selectedItems: ['item-checkboxes', 'item-slider'],
    },
  ].forEach(({ expectedValue, calculationType, selectedItems }) => {
    it(`Should return ${expectedValue} when calculationType is ${calculationType} and selectedItems are ${selectedItems} and no set conditions`, () => {
      const pipelineItems: PipelineItem[] = [];

      const radiosItem: PipelineItem = getRadiosItem();

      const checkBoxesItem: PipelineItem = getCheckboxesItem();

      const sliderItem: PipelineItem = getSliderItem();

      pipelineItems.push(radiosItem);
      pipelineItems.push(checkBoxesItem);
      pipelineItems.push(sliderItem);

      const radioAnswer: RadioResponse = radiosItem.payload.options[0];

      const checkBoxAnswer: Item[] = [
        checkBoxesItem.payload.options[1],
        checkBoxesItem.payload.options[2],
      ];

      const sliderAnswer: SliderResponse = 7;

      const answers: Answers = {
        0: { answer: radioAnswer },
        1: {
          answer: checkBoxAnswer,
        },
        2: { answer: sliderAnswer },
      };

      const reportSettings: Report[] = [
        {
          calculationType: calculationType as CalculationType,
          conditionalLogic: [],
          id: 'mock-report-id-1',
          includedItems: selectedItems,
          name: 'mock-report-name-1',
          type: 'score',
        },
      ];

      const result: ScoreRecord[] = extractor.extract(
        pipelineItems,
        answers,
        reportSettings,
        'mock-log-activity-name-1',
      );

      const expected: ScoreRecord[] = [
        { flagged: false, name: 'mock-report-name-1', value: expectedValue },
      ];

      expect(result).toEqual(expected);
    });
  });

  it("Should return 517 and flagged set to true when calculationType is 'sum' and one condition is set: equal to 517", () => {
    const pipelineItems: PipelineItem[] = [];

    const radiosItem: PipelineItem = getRadiosItem();

    const checkBoxesItem: PipelineItem = getCheckboxesItem();

    const sliderItem: PipelineItem = getSliderItem();

    pipelineItems.push(radiosItem);
    pipelineItems.push(checkBoxesItem);
    pipelineItems.push(sliderItem);

    const radioAnswer: RadioResponse = radiosItem.payload.options[0];

    const checkBoxAnswer: Item[] = [
      checkBoxesItem.payload.options[1],
      checkBoxesItem.payload.options[2],
    ];

    const sliderAnswer: SliderResponse = 7;

    const answers: Answers = {
      0: { answer: radioAnswer },
      1: {
        answer: checkBoxAnswer,
      },
      2: { answer: sliderAnswer },
    };

    const reportSettings: Report[] = [
      {
        calculationType: 'sum',
        conditionalLogic: [
          {
            conditions: [
              {
                itemName: 'mock-condition-item-name-1',
                type: 'EQUAL',
                payload: { value: 517 },
              },
            ],
            flagScore: true,
            id: 'mock-condition-id-1',
            match: 'all',
            name: 'mock-condition-name-1',
          },
        ],
        id: 'mock-report-id-1',
        includedItems: [
          radiosItem.name!,
          checkBoxesItem.name!,
          sliderItem.name!,
        ],
        name: 'mock-report-name-1',
        type: 'score',
      },
    ];

    const result: ScoreRecord[] = extractor.extract(
      pipelineItems,
      answers,
      reportSettings,
      'mock-log-activity-name-1',
    );

    const expected: ScoreRecord[] = [
      { flagged: true, name: 'mock-report-name-1', value: 517 },
    ];

    expect(result).toEqual(expected);
  });
});
