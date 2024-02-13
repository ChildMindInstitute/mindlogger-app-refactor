import { Report } from '@app/entities/activity';

import { Answers, PipelineItem } from '../../lib';
import { IScoresCalculator, ScoresCalculator } from '../ScoresCalculator';

describe('ScoresCalculator: test calculate', () => {
  const mockPipelineItems = [
    {} as PipelineItem,
    {} as PipelineItem,
    {} as PipelineItem,
  ];
  const mockAnswers = {} as Answers;

  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should return null when collectActualScores returns arrays with nulls', () => {
    const mockCollectActualScores = jest
      .fn()
      .mockReturnValue([null, null, null]);
    //@ts-expect-error
    calculator.collectActualScores = mockCollectActualScores;

    const result = calculator.calculate(
      mockPipelineItems,
      mockAnswers,
      {} as Report,
    );

    expect(result).toEqual(null);
    expect(mockCollectActualScores).toBeCalledTimes(1);
  });

  it('Should return NaN when collectActualScores returns arrays with nulls and undefined and calculationType is sum', () => {
    const mockCollectActualScores = jest
      .fn()
      .mockReturnValue([null, undefined, null]);
    //@ts-expect-error
    calculator.collectActualScores = mockCollectActualScores;

    const result = calculator.calculate(mockPipelineItems, mockAnswers, {
      calculationType: 'sum',
    } as Report);

    expect(result).toEqual(NaN);
    expect(mockCollectActualScores).toBeCalledTimes(1);
  });

  it('Should return 12 when collectActualScores returns arrays with [1,3,8] and calculationType is sum', () => {
    //@ts-expect-error
    calculator.collectActualScores = jest.fn().mockReturnValue([1, 3, 8]);

    const result = calculator.calculate(mockPipelineItems, mockAnswers, {
      calculationType: 'sum',
    } as Report);

    expect(result).toEqual(12);
  });

  it('Should return 4 when collectActualScores returns arrays with [1,3,8] and calculationType is avg', () => {
    //@ts-expect-error
    calculator.collectActualScores = jest.fn().mockReturnValue([1, 3, 8]);

    const result = calculator.calculate(mockPipelineItems, mockAnswers, {
      calculationType: 'average',
    } as Report);

    expect(result).toEqual(4);
  });

  it('Should return 75 when collectActualScores returns arrays with [1,3,8] and collectMaxScores returns [1,3,12] and calculationType is percentage', () => {
    //@ts-expect-error
    calculator.collectActualScores = jest.fn().mockReturnValue([1, 3, 8]);

    //@ts-expect-error
    calculator.collectMaxScores = jest.fn().mockReturnValue([1, 3, 12]);

    const result = calculator.calculate(mockPipelineItems, mockAnswers, {
      calculationType: 'percentage',
    } as Report);

    expect(result).toEqual(75);
  });

  it('Should return NaN when collectActualScores returns arrays with [1,3,8] and collectMaxScores returns [2,null,undefined] and calculationType is percentage', () => {
    //@ts-expect-error
    calculator.collectActualScores = jest.fn().mockReturnValue([1, 3, 8]);

    //@ts-expect-error
    calculator.collectMaxScores = jest
      .fn()
      .mockReturnValue([2, null, undefined]);

    const result = calculator.calculate(mockPipelineItems, mockAnswers, {
      calculationType: 'percentage',
    } as Report);

    expect(result).toEqual(NaN);
  });
});
