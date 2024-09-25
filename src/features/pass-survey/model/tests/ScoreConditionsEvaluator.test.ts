import { ScoreConditionalLogic } from '@app/entities/activity/lib/types/activityReportSettings';

import { IScoreConditionsEvaluator } from '../IScoreConditionsEvaluator';
import { ScoreConditionsEvaluator } from '../ScoreConditionsEvaluator';

describe('ScoreConditionsEvaluator test', () => {
  let evaluator: IScoreConditionsEvaluator;

  beforeEach(() => {
    evaluator = new ScoreConditionsEvaluator();
  });

  it('Should return true when conditions array is empty and match is all', () => {
    const settings: ScoreConditionalLogic = {
      name: 'mock-name',
      match: 'all',
      id: 'mock-id',
      flagScore: false,
      conditions: [],
    };

    const result = evaluator.evaluate(settings, 0);
    expect(result).toEqual(true);
  });

  it('Should return false when conditions array is empty and match is any', () => {
    const settings: ScoreConditionalLogic = {
      name: 'mock-name',
      match: 'any',
      id: 'mock-id',
      flagScore: false,
      conditions: [],
    };

    const result = evaluator.evaluate(settings, 0);
    expect(result).toEqual(false);
  });

  describe('Test BETWEEN operator', () => {
    [
      { min: 1, max: 4, score: 1, result: false },
      { min: 1, max: 4, score: 2, result: true },
      { min: 1, max: 4, score: 3, result: true },
      { min: 1, max: 4, score: 4, result: false },

      { min: -4, max: -1, score: -1, result: false },
      { min: -4, max: -1, score: -2, result: true },
      { min: -4, max: -1, score: -3, result: true },
      { min: -4, max: -1, score: -4, result: false },

      { min: -2, max: 2, score: -2, result: false },
      { min: -2, max: 2, score: -1, result: true },
      { min: -2, max: 2, score: 0, result: true },
      { min: -2, max: 2, score: 1, result: true },
      { min: -2, max: 2, score: 2, result: false },
    ].forEach(({ min, max, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when min is ${min} and max is ${max} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'BETWEEN',
              payload: {
                minValue: min,
                maxValue: max,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test EQUAL operator', () => {
    [
      { value: 3, score: 3, result: true },
      { value: 0, score: 0, result: true },
      { value: -3, score: -3, result: true },
      { value: -1, score: 0, result: false },
      { value: 0, score: -1, result: false },
    ].forEach(({ value, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when value is ${value} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'EQUAL',
              payload: {
                value,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test NOT EQUAL operator', () => {
    [
      { value: 3, score: 5, result: true },
      { value: -3, score: -5, result: true },
      { value: 3, score: -5, result: true },
      { value: 3, score: 3, result: false },
      { value: 0, score: 0, result: false },
      { value: -3, score: -3, result: false },
      { value: -1, score: 0, result: true },
      { value: 0, score: -1, result: true },
    ].forEach(({ value, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when value is ${value} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'NOT_EQUAL',
              payload: {
                value,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test GREATER_THAN operator', () => {
    [
      { value: -3, score: -3, result: false },
      { value: -3, score: -2, result: true },
      { value: -3, score: 0, result: true },
      { value: -3, score: 3, result: true },

      { value: -1, score: 0, result: true },

      { value: 0, score: 0, result: false },
      { value: 0, score: 1, result: true },

      { value: 2, score: 2, result: false },
      { value: 2, score: 3, result: true },
    ].forEach(({ value, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when value is ${value} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'GREATER_THAN',
              payload: {
                value,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test LESS_THAN operator', () => {
    [
      { value: 3, score: 3, result: false },
      { value: 3, score: 2, result: true },
      { value: 3, score: 0, result: true },
      { value: 3, score: -1, result: true },

      { value: 1, score: 0, result: true },
      { value: 0, score: 0, result: false },
      { value: 0, score: -1, result: true },

      { value: -2, score: -2, result: false },
      { value: -2, score: -3, result: true },
    ].forEach(({ value, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when value is ${value} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'LESS_THAN',
              payload: {
                value,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test OUTSIDE_OF operator', () => {
    [
      { minValue: 1, maxValue: 3, score: 1, result: false },
      { minValue: 1, maxValue: 3, score: 2, result: false },
      { minValue: 1, maxValue: 3, score: 3, result: false },
      { minValue: 1, maxValue: 3, score: 0, result: true },
      { minValue: 1, maxValue: 3, score: -1, result: true },
      { minValue: 1, maxValue: 3, score: 4, result: true },

      { minValue: -3, maxValue: -1, score: -1, result: false },
      { minValue: -3, maxValue: -1, score: -2, result: false },
      { minValue: -3, maxValue: -1, score: -3, result: false },
      { minValue: -3, maxValue: -1, score: 0, result: true },
      { minValue: -3, maxValue: -1, score: 1, result: true },
      { minValue: -3, maxValue: -1, score: -4, result: true },

      { minValue: -1, maxValue: 1, score: -1, result: false },
      { minValue: -1, maxValue: 1, score: 0, result: false },
      { minValue: -1, maxValue: 1, score: 1, result: false },
      { minValue: -1, maxValue: 1, score: -2, result: true },
      { minValue: -1, maxValue: 1, score: 2, result: true },
    ].forEach(({ minValue, maxValue, score, result: expectedResult }) => {
      it(`Should return ${expectedResult} when minValue is ${minValue} and maxValue is ${minValue} and score is ${score}`, () => {
        const settings: ScoreConditionalLogic = {
          name: 'mock-name',
          match: 'any',
          id: 'mock-id',
          flagScore: false,
          conditions: [
            {
              itemName: 'mock-item-1',
              type: 'OUTSIDE_OF',
              payload: {
                minValue,
                maxValue,
              },
            },
          ],
        };

        const result = evaluator.evaluate(settings, score);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('Test match setting', () => {
    it('Should return true when both 2 conditions are valid and match is all', () => {
      const settings: ScoreConditionalLogic = {
        name: 'mock-name',
        match: 'all',
        id: 'mock-id',
        flagScore: false,
        conditions: [
          {
            itemName: 'mock-item-1',
            type: 'EQUAL',
            payload: {
              value: 1,
            },
          },
          {
            itemName: 'mock-item-1',
            type: 'NOT_EQUAL',
            payload: {
              value: 2,
            },
          },
        ],
      };

      const result = evaluator.evaluate(settings, 1);
      expect(result).toEqual(true);
    });

    it('Should return false when one of 2 conditions is valid another is not and match is all', () => {
      const settings: ScoreConditionalLogic = {
        name: 'mock-name',
        match: 'all',
        id: 'mock-id',
        flagScore: false,
        conditions: [
          {
            itemName: 'mock-item-1',
            type: 'EQUAL',
            payload: {
              value: 1,
            },
          },
          {
            itemName: 'mock-item-1',
            type: 'NOT_EQUAL',
            payload: {
              value: 1,
            },
          },
        ],
      };

      const result = evaluator.evaluate(settings, 1);
      expect(result).toEqual(false);
    });

    it('Should return true when both 2 conditions are valid and match is any', () => {
      const settings: ScoreConditionalLogic = {
        name: 'mock-name',
        match: 'any',
        id: 'mock-id',
        flagScore: false,
        conditions: [
          {
            itemName: 'mock-item-1',
            type: 'EQUAL',
            payload: {
              value: 1,
            },
          },
          {
            itemName: 'mock-item-1',
            type: 'NOT_EQUAL',
            payload: {
              value: 2,
            },
          },
        ],
      };

      const result = evaluator.evaluate(settings, 1);
      expect(result).toEqual(true);
    });

    it('Should return true when one of 2 conditions is valid and another is not and match is any', () => {
      const settings: ScoreConditionalLogic = {
        name: 'mock-name',
        match: 'any',
        id: 'mock-id',
        flagScore: false,
        conditions: [
          {
            itemName: 'mock-item-1',
            type: 'EQUAL',
            payload: {
              value: 1,
            },
          },
          {
            itemName: 'mock-item-1',
            type: 'NOT_EQUAL',
            payload: {
              value: 1,
            },
          },
        ],
      };

      const result = evaluator.evaluate(settings, 1);
      expect(result).toEqual(true);
    });

    it('Should return false when both 2 conditions are not valid and match is any', () => {
      const settings: ScoreConditionalLogic = {
        name: 'mock-name',
        match: 'any',
        id: 'mock-id',
        flagScore: false,
        conditions: [
          {
            itemName: 'mock-item-1',
            type: 'EQUAL',
            payload: {
              value: 1,
            },
          },
          {
            itemName: 'mock-item-1',
            type: 'NOT_EQUAL',
            payload: {
              value: 2,
            },
          },
        ],
      };

      const result = evaluator.evaluate(settings, 2);
      expect(result).toEqual(false);
    });
  });
});
