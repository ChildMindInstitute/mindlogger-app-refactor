import { RadioResponse, RadioPipelineItem } from '../../lib';
import { IScoresCalculator, ScoresCalculator } from '../ScoresCalculator';

type WrappedAnswer = { answer: RadioResponse };

const getAnswer = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return {
      answer: value,
    } as unknown as WrappedAnswer;
  }

  const result = {
    answer: {
      color: null,
      id: 'mock-id-1',
      image: null,
      isHidden: false,
      score: null,
      value: value,
      text: 'mock-text-1',
      tooltip: null,
    },
  } as WrappedAnswer;
  return result;
};

const getEmptyItem = (): RadioPipelineItem => {
  const result: RadioPipelineItem = {
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [],
      autoAdvance: false,
      isGridView: false,
    },
    type: 'Radio',
  };
  return result;
};

const fillOptions = (item: RadioPipelineItem, from = 1) => {
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
    });
  }
};

describe('ScoresCalculator: test collectScoreForRadio', () => {
  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should return null when value is undefined', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(undefined);

    const item: RadioPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return null when value is null', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(null);

    const item: RadioPipelineItem = getEmptyItem();

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return 30 when value is 3', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(3);

    const item: RadioPipelineItem = getEmptyItem();

    fillOptions(item);

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(30);
  });

  it('Should return null when value is out of range (eq. to 10)', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(10);

    const item: RadioPipelineItem = getEmptyItem();

    fillOptions(item);

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(null);
  });

  it('Should return 0 when value is 0 and there is an option with score eq equal to 0 and value equal to 0 correspondingly', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(0);

    const item: RadioPipelineItem = getEmptyItem();

    fillOptions(item, 0);

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(0);
  });

  it('Should return null when value is 0 and there is no any option with score eq equal to 0 and value equal to 0 correspondingly', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer(0);

    const item: RadioPipelineItem = getEmptyItem();

    fillOptions(item);

    // @ts-expect-error
    const result = calculator.collectScoreForRadio(item, wrappedAnswer);

    expect(result).toEqual(null);
  });
});
