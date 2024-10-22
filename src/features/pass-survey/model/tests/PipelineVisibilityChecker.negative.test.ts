import {
  fillOptionsForRadio,
  getEmptyRadioItem,
  getRadioResponse,
} from './testHelpers';
import { Answers } from '../../lib/hooks/useActivityStorageRecord';
import { PipelineVisibilityChecker } from '../PipelineVisibilityChecker';

describe('PipelineVisibilityChecker: negative tests', () => {
  it('Should return false when index is out of range', () => {
    const radioItem1 = getEmptyRadioItem('mock-radio-name-1');
    fillOptionsForRadio(radioItem1);

    const radioItem2 = getEmptyRadioItem('mock-radio-name-2');
    fillOptionsForRadio(radioItem2);

    radioItem1.conditionalLogic = {
      match: 'any',
      conditions: [
        {
          activityItemName: 'mock-radio-name-2',
          type: 'EQUAL_TO_OPTION',
          payload: {
            optionValue: '1',
          },
        },
      ],
    };

    const items = [radioItem1, radioItem2];

    const answer1 = { answer: getRadioResponse(1) };
    const answer2 = { answer: getRadioResponse(1) };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(2);

    expect(result).toEqual(false);
  });

  it('Should return true when condition logic is not set', () => {
    const radioItem1 = getEmptyRadioItem('mock-radio-name-1');
    fillOptionsForRadio(radioItem1);

    const radioItem2 = getEmptyRadioItem('mock-radio-name-2');
    fillOptionsForRadio(radioItem2);

    radioItem1.conditionalLogic = undefined;

    const items = [radioItem1, radioItem2];

    const answer1 = { answer: getRadioResponse(1) };
    const answer2 = { answer: getRadioResponse(1) };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return true when type is out of range', () => {
    const radioItem1 = getEmptyRadioItem('mock-radio-name-1');
    fillOptionsForRadio(radioItem1);

    const radioItem2 = getEmptyRadioItem('mock-radio-name-2');
    fillOptionsForRadio(radioItem2);

    radioItem1.conditionalLogic = {
      match: 'any',
      conditions: [
        {
          activityItemName: 'mock-radio-name-2',
          //@ts-expect-error
          type: 'WRONG_TYPE',
          payload: {
            optionValue: '123',
          },
        },
      ],
    };

    const items = [radioItem1, radioItem2];

    const answer1 = { answer: getRadioResponse(1) };
    const answer2 = { answer: getRadioResponse(1) };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when answers is null', () => {
    const radioItem1 = getEmptyRadioItem('mock-radio-name-1');
    fillOptionsForRadio(radioItem1);

    const radioItem2 = getEmptyRadioItem('mock-radio-name-2');
    fillOptionsForRadio(radioItem2);

    radioItem1.conditionalLogic = {
      match: 'any',
      conditions: [
        {
          activityItemName: 'mock-radio-name-2',
          type: 'BETWEEN',
          payload: {} as any,
        },
      ],
    };

    const items = [radioItem1, radioItem2];

    const answers = null;

    const { isItemVisible } = PipelineVisibilityChecker(items, answers as any);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });
});
