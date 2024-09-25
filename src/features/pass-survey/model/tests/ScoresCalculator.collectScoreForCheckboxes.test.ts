import {
  CheckboxPipelineItem,
  CheckboxResponse,
} from '../../lib/types/payload';
import { IScoresCalculator } from '../IScoresCalculator';
import { ScoresCalculator } from '../ScoresCalculator';

type WrappedAnswer = { answer: CheckboxResponse };

const getAnswer = (value: number[] | null | undefined): WrappedAnswer => {
  if (value === null || value === undefined) {
    return {
      answer: value,
    } as unknown as WrappedAnswer;
  }

  const result: WrappedAnswer = {
    answer: [],
  };

  result.answer = value.map((v, index) => ({
    color: null,
    id: 'mock-id-' + index,
    image: null,
    isHidden: false,
    score: null,
    value: v,
    text: 'mock-text-' + index,
    tooltip: null,
  }));

  return result;
};

const getEmptyItem = (): CheckboxPipelineItem => {
  const result: CheckboxPipelineItem = {
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      isGridView: false,
      options: [],
    },
    type: 'Checkbox',
  };
  return result;
};

const fillOptions = (item: CheckboxPipelineItem, from = 1) => {
  for (let i = from; i <= 5; i++) {
    item.payload.options.push({
      alert: null,
      color: null,
      id: 'mock-id-' + i,
      image: null,
      isHidden: false,
      text: 'mock-text-' + i,
      tooltip: null,
      score: i * 10,
      value: i,
      isNoneOption: false,
    });
  }
};

describe('ScoresCalculator: test collectScoreForCheckboxes', () => {
  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should return null when value is undefined', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(undefined);

    const item: CheckboxPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return null when value is null', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(null);

    const item: CheckboxPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return 100 when value is [2, 3, 5]', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer([2, 3, 5]);

    const item: CheckboxPipelineItem = getEmptyItem();

    fillOptions(item);

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(100);
  });

  it('Should return 0 when value is [0]', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer([0]);

    const item: CheckboxPipelineItem = getEmptyItem();

    fillOptions(item, 0);

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(0);
  });

  it('Should return 30 when value is [0, 1, 2]', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer([0, 1, 2]);

    const item: CheckboxPipelineItem = getEmptyItem();

    fillOptions(item, 0);

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(30);
  });

  it('Should return 90 when value is [4, 5, 6, 7]', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer([4, 5, 6, 7]);

    const item: CheckboxPipelineItem = getEmptyItem();

    fillOptions(item);

    // @ts-expect-error
    const result = calculator.collectScoreForCheckboxes(item, wrappedAnswer);

    expect(result).toEqual(90);
  });
});
