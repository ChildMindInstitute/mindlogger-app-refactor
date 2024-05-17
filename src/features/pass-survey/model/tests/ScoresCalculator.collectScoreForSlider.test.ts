import { SliderPipelineItem, SliderResponse } from '../../lib';
import { IScoresCalculator, ScoresCalculator } from '../ScoresCalculator';

type WrappedAnswer = { answer: SliderResponse };

const getAnswer = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return {
      answer: value,
    } as unknown as WrappedAnswer;
  }

  return { answer: value };
};

const getEmptyItem = (): SliderPipelineItem => {
  const result: SliderPipelineItem = {
    timer: null,
    payload: {
      isContinuousSlider: false,
      leftImageUrl: null,
      rightImageUrl: null,
      leftTitle: 'left-title',
      rightTitle: 'right-title',
      showTickLabels: false,
      showTickMarks: false,
      alerts: null,
      scores: [],
      minValue: 2,
      maxValue: 9,
    },
    type: 'Slider',
  };
  return result;
};

const fillOptions = (item: SliderPipelineItem, count: number) => {
  for (let i = 0; i < count; i++) {
    item.payload.scores.push(i * 10);
  }
};

describe('ScoresCalculator: test collectScoreForRadio', () => {
  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should return null when value is undefined', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(undefined);

    const item: SliderPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return null when value is null', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(null);

    const item: SliderPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return null when value is 1', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(1);

    const item: SliderPipelineItem = getEmptyItem();
    fillOptions(item, item.payload.maxValue - item.payload.minValue + 1);

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return 0 when value is 2', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(2);

    const item: SliderPipelineItem = getEmptyItem();
    fillOptions(item, item.payload.maxValue - item.payload.minValue + 1);

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(0);
  });

  it('Should return 10 when value is 3', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(3);

    const item: SliderPipelineItem = getEmptyItem();
    fillOptions(item, item.payload.maxValue - item.payload.minValue + 1);

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(10);
  });

  it('Should return 70 when value is 9', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(9);

    const item: SliderPipelineItem = getEmptyItem();
    fillOptions(item, item.payload.maxValue - item.payload.minValue + 1);

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(70);
  });

  it('Should return null when value is 10', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(10);

    const item: SliderPipelineItem = getEmptyItem();
    fillOptions(item, item.payload.maxValue - item.payload.minValue + 1);

    // @ts-expect-error
    const result = calculator.collectScoreForSlider(item, wrappedAnswer);

    expect(result).toEqual(null);
  });
});
