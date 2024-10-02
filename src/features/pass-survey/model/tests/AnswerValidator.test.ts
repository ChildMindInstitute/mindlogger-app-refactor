import { ConditionType } from '@app/entities/activity/lib/types/conditionalLogic';
import { IAnswerValidator } from '@features/pass-survey/model/IAnswerValidator.ts';

import { getEmptySliderItem, getTimeRangeItem } from './testHelpers';
import { Answers } from '../../lib/hooks/useActivityStorageRecord';
import { AnswerValidator } from '../AnswerValidator';

const imitateValidate = (validator: IAnswerValidator, type: ConditionType) => {
  let result;

  switch (type) {
    case 'BETWEEN': {
      result = validator.isBetweenValues(0, 10);
      break;
    }
    case 'EQUAL':
    case 'NOT_EQUAL': {
      result = validator.isEqualToValue('0');
      break;
    }
    case 'EQUAL_TO_OPTION':
    case 'NOT_EQUAL_TO_OPTION': {
      result = validator.isEqualToOption('0');
      break;
    }
    case 'GREATER_THAN': {
      result = validator.isGreaterThen(0);
      break;
    }
    case 'LESS_THAN': {
      result = validator.isLessThen(10);
      break;
    }
    case 'INCLUDES_OPTION': {
      result = validator.includesOption('0');
      break;
    }
    case 'NOT_INCLUDES_OPTION': {
      result = validator.notIncludesOption('0');
      break;
    }
    case 'OUTSIDE_OF': {
      result = validator.isOutsideOfValues(0, 10);
      break;
    }
  }

  return result;
};

describe('AnswerValidator tests', () => {
  const tests: ConditionType[] = [
    'BETWEEN',
    'EQUAL',
    'EQUAL_TO_OPTION',
    'GREATER_THAN',
    'INCLUDES_OPTION',
    'LESS_THAN',
    'NOT_EQUAL',
    'NOT_EQUAL_TO_OPTION',
    'NOT_INCLUDES_OPTION',
    'OUTSIDE_OF',
  ];

  tests.forEach(t => {
    it(`Should return false when answers[i] is null and type is ${t}`, () => {
      const items = [{}, {}];

      const answers = {
        '0': null,
        '1': null,
      };

      const validator = AnswerValidator({
        items: items as any,
        answers: answers as any,
        step: 0,
      });

      const result = imitateValidate(validator, t);

      expect(result).toEqual(false);
    });
  });

  tests.forEach(t => {
    it(`Should return false when answers[i].answer is null and type is ${t}`, () => {
      const items = [{}, {}];

      const answer1 = { answer: null };
      const answer2 = { answer: null };

      const answers: Answers = {
        '0': answer1,
        '1': answer2,
      };

      const validator = AnswerValidator({
        items: items as any,
        answers: answers as any,
        step: 0,
      });

      const result = imitateValidate(validator, t);

      expect(result).toEqual(false);
    });
  });

  tests.forEach(t => {
    it(`Should return false when answers[i] is undefined and type is ${t}`, () => {
      const items = [{}, {}];

      const answers = {
        '0': undefined,
        '1': undefined,
      };

      const validator = AnswerValidator({
        items: items as any,
        answers: answers as any,
        step: 0,
      });

      const result = imitateValidate(validator, t);

      expect(result).toEqual(false);
    });
  });

  tests.forEach(t => {
    it(`Should return false when answers[i].answer is undefined and type is ${t}`, () => {
      const items = [{}, {}];

      const answer1 = { answer: undefined };
      const answer2 = { answer: undefined };

      const answers: Answers = {
        '0': answer1,
        '1': answer2,
      };

      const validator = AnswerValidator({
        items: items as any,
        answers: answers as any,
        step: 0,
      });

      const result = imitateValidate(validator, t);

      expect(result).toEqual(false);
    });
  });

  it('Should return true when validationOptions.correctAnswer is the same as in the item', () => {
    const sliderItem1 = getEmptySliderItem('mock-slider-name-1');
    const sliderItem2 = getEmptySliderItem('mock-slider-name-2');

    const items = [sliderItem1, sliderItem2];

    sliderItem2.validationOptions = {
      correctAnswer: '5',
    };

    const answer1 = { answer: '1' };
    const answer2 = { answer: '5' };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 1,
    });

    const result = validator.isCorrect();

    expect(result).toEqual(true);
  });

  it('Should return false when validationOptions.correctAnswer is not the same as in the item', () => {
    const sliderItem1 = getEmptySliderItem('mock-slider-name-1');
    const sliderItem2 = getEmptySliderItem('mock-slider-name-2');

    const items = [sliderItem1, sliderItem2];

    sliderItem2.validationOptions = {
      correctAnswer: '1',
    };

    const answer1 = { answer: '1' };
    const answer2 = { answer: '2' };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 1,
    });

    const result = validator.isCorrect();

    expect(result).toEqual(false);
  });

  it('Should return true when validationOptions is not present', () => {
    const sliderItem1 = getEmptySliderItem('mock-slider-name-1');

    const items = [sliderItem1];

    const answer1 = { answer: '1' };

    const answers: Answers = {
      '0': answer1,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 1,
    });

    const result = validator.isCorrect();

    expect(result).toEqual(true);
  });

  it('Should return true if slider item has (any) answer ', () => {
    const sliderItem = getEmptySliderItem('mock-slider-name-2');

    const items = [sliderItem];

    const answer = { answer: '2' };

    const answers: Answers = {
      '0': answer,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 0,
    });

    const result = validator.isValidAnswer();

    expect(result).toEqual(true);
  });

  it('Should return true when timeRange answer has both startTime and endTime set ', () => {
    const timeRangeItem = getTimeRangeItem();

    const items = [timeRangeItem];

    const answer = {
      answer: {
        startTime: {
          hours: 1,
          minutes: 2,
        },
        endTime: {
          hours: 1,
          minutes: 2,
        },
      },
    };

    const answers: Answers = {
      '0': answer,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 0,
    });

    const result = validator.isValidAnswer();

    expect(result).toEqual(true);
  });

  it('Should return false when timeRange answer does not have both startTime and endTime set', () => {
    const timeRangeItem = getTimeRangeItem();

    const items = [timeRangeItem];

    const answer = {
      answer: {
        startTime: {
          hours: 1,
          minutes: 2,
        },
        endTime: null,
      },
    };

    const answers: Answers = {
      '0': answer,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 0,
    });

    const result = validator.isValidAnswer();

    expect(result).toEqual(false);
  });

  it('Should return true when timeRange item answer is null', () => {
    const timeRangeItem = getTimeRangeItem();

    const items = [timeRangeItem];

    const answer = {
      answer: null,
    };

    const answers: Answers = {
      '0': answer,
    };

    const validator = AnswerValidator({
      items: items as any,
      answers: answers as any,
      step: 0,
    });

    const result = validator.isValidAnswer();

    expect(result).toEqual(true);
  });
});
