import { ActivityItemType, PipelineItem } from '../../lib/types/payload';
import { IScoresCalculator } from '../IScoresCalculator';
import { ScoresCalculator } from '../ScoresCalculator';

type WrappedAnswer = { answer: any };

const getAnswer = () => {
  const result = {
    answer: {},
  } as WrappedAnswer;
  return result;
};

const getMockItem = (type: ActivityItemType): PipelineItem => {
  const result: PipelineItem = {
    payload: {},
    type,
  } as PipelineItem;
  return result;
};

describe('ScoresCalculator: test collectScoreForItem', () => {
  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should call collectScoreForCheckboxes once when item.type is checkbox', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer();

    const item: PipelineItem = getMockItem('Checkbox');

    const mockCollectScoreForSlider = jest.fn();
    const mockCollectScoreForRadio = jest.fn();
    const mockCollectScoreForCheckboxes = jest.fn();

    //@ts-expect-error
    calculator.collectScoreForSlider = mockCollectScoreForSlider;
    //@ts-expect-error
    calculator.collectScoreForRadio = mockCollectScoreForRadio;
    //@ts-expect-error
    calculator.collectScoreForCheckboxes = mockCollectScoreForCheckboxes;

    // @ts-expect-error
    calculator.collectScoreForItem(item, wrappedAnswer);

    expect(mockCollectScoreForCheckboxes).toHaveBeenCalledTimes(1);
    expect(mockCollectScoreForSlider).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForRadio).toHaveBeenCalledTimes(0);
  });

  it('Should call mockCollectScoreForSlider once when item.type is slider', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer();

    const item: PipelineItem = getMockItem('Slider');

    const mockCollectScoreForSlider = jest.fn();
    const mockCollectScoreForRadio = jest.fn();
    const mockCollectScoreForCheckboxes = jest.fn();

    //@ts-expect-error
    calculator.collectScoreForSlider = mockCollectScoreForSlider;
    //@ts-expect-error
    calculator.collectScoreForRadio = mockCollectScoreForRadio;
    //@ts-expect-error
    calculator.collectScoreForCheckboxes = mockCollectScoreForCheckboxes;

    // @ts-expect-error
    calculator.collectScoreForItem(item, wrappedAnswer);

    expect(mockCollectScoreForCheckboxes).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForSlider).toHaveBeenCalledTimes(1);
    expect(mockCollectScoreForRadio).toHaveBeenCalledTimes(0);
  });

  it('Should call mockCollectScoreForRadio once when item.type is radio', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer();

    const item: PipelineItem = getMockItem('Radio');

    const mockCollectScoreForSlider = jest.fn();
    const mockCollectScoreForRadio = jest.fn();
    const mockCollectScoreForCheckboxes = jest.fn();

    //@ts-expect-error
    calculator.collectScoreForSlider = mockCollectScoreForSlider;
    //@ts-expect-error
    calculator.collectScoreForRadio = mockCollectScoreForRadio;
    //@ts-expect-error
    calculator.collectScoreForCheckboxes = mockCollectScoreForCheckboxes;

    // @ts-expect-error
    calculator.collectScoreForItem(item, wrappedAnswer);

    expect(mockCollectScoreForCheckboxes).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForSlider).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForRadio).toHaveBeenCalledTimes(1);
  });

  it('Should return null and should not call any collect function when item.type is radio and answer is null', () => {
    const item: PipelineItem = getMockItem('Radio');

    const mockCollectScoreForSlider = jest.fn();
    const mockCollectScoreForRadio = jest.fn();
    const mockCollectScoreForCheckboxes = jest.fn();

    //@ts-expect-error
    calculator.collectScoreForSlider = mockCollectScoreForSlider;
    //@ts-expect-error
    calculator.collectScoreForRadio = mockCollectScoreForRadio;
    //@ts-expect-error
    calculator.collectScoreForCheckboxes = mockCollectScoreForCheckboxes;

    // @ts-expect-error
    const result = calculator.collectScoreForItem(item, null);

    expect(result).toEqual(null);
    expect(mockCollectScoreForCheckboxes).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForSlider).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForRadio).toHaveBeenCalledTimes(0);
  });

  it('Should return null and should not call any collect function when item.type is audio', () => {
    const wrappedAnswer: WrappedAnswer = getAnswer();

    const item: PipelineItem = getMockItem('Audio');

    const mockCollectScoreForSlider = jest.fn();
    const mockCollectScoreForRadio = jest.fn();
    const mockCollectScoreForCheckboxes = jest.fn();

    //@ts-expect-error
    calculator.collectScoreForSlider = mockCollectScoreForSlider;
    //@ts-expect-error
    calculator.collectScoreForRadio = mockCollectScoreForRadio;
    //@ts-expect-error
    calculator.collectScoreForCheckboxes = mockCollectScoreForCheckboxes;

    // @ts-expect-error
    const result = calculator.collectScoreForItem(item, wrappedAnswer);

    expect(result).toEqual(null);
    expect(mockCollectScoreForCheckboxes).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForSlider).toHaveBeenCalledTimes(0);
    expect(mockCollectScoreForRadio).toHaveBeenCalledTimes(0);
  });
});
