import {
  ConditionType,
  Match,
} from '@app/entities/activity/lib/types/conditionalLogic';

import {
  fillOptionsForCheckboxes,
  fillOptionsForRadio,
  getCheckboxResponse,
  getEmptyCheckboxesItem as getCheckboxesItem,
  getEmptyRadioItem as getRadioItem,
  getSliderItem,
  getRadioResponse,
} from './testHelpers';
import { Answers } from '../../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../../lib/types/payload';
import { PipelineVisibilityChecker } from '../PipelineVisibilityChecker';

describe('PipelineVisibilityChecker: penetration tests', () => {
  const getRadioItems = (names: string[]) => {
    return names.map(name => {
      return fillOptionsForRadio(getRadioItem(name));
    });
  };

  const getCheckboxItems = (names: string[]) => {
    return names.map(name => {
      return fillOptionsForCheckboxes(getCheckboxesItem(name));
    });
  };

  const setCondition = (
    itemSetTo: PipelineItem,
    itemPointedTo: PipelineItem,
    match: Match,
    type: ConditionType,
    payload: any,
  ) => {
    itemSetTo.conditionalLogic = {
      match: match,
      conditions: [{ activityItemName: itemPointedTo.name!, type, payload }],
    };
  };

  it('Should return true when 2nd item set to the specified value and its type is EQUAL_TO_OPTION', () => {
    const items = getRadioItems(['mock-radio-name-1', 'mock-radio-name-2']);

    setCondition(items[0], items[1], 'any', 'EQUAL_TO_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getRadioResponse(1) },
      '1': { answer: getRadioResponse(1) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when 2nd item set to the other value and type is EQUAL_TO_OPTION', () => {
    const items = getRadioItems(['mock-radio-name-1', 'mock-radio-name-2']);

    setCondition(items[0], items[1], 'all', 'EQUAL_TO_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getRadioResponse(1) },
      '1': { answer: getRadioResponse(3) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when 2nd item set to the other value and type is NOT_EQUAL_TO_OPTION', () => {
    const items = getRadioItems(['mock-radio-name-1', 'mock-radio-name-2']);

    setCondition(items[0], items[1], 'all', 'NOT_EQUAL_TO_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getRadioResponse(1) },
      '1': { answer: getRadioResponse(3) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when 2nd item set to the same value and type is NOT_EQUAL_TO_OPTION', () => {
    const items = getRadioItems(['mock-radio-name-1', 'mock-radio-name-2']);

    setCondition(items[0], items[1], 'any', 'NOT_EQUAL_TO_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getRadioResponse(1) },
      '1': { answer: getRadioResponse(1) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item set to greater value and type is GREATER_THAN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'GREATER_THAN', { value: 1 });

    const answers: Answers = {
      '0': { answer: 1 },
      '1': { answer: 2 },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the same value and type is GREATER_THAN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'GREATER_THAN', { value: 1 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 1 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item set to less value and type is LESS_THAN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'LESS_THAN', { value: 2 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 1 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the same value and type is LESS_THAN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'LESS_THAN', { value: 2 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 2 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item set to the value between and type is BETWEEN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'BETWEEN', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 3 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the left border value and type is BETWEEN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'BETWEEN', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 2 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return false when item set to the right border value and type is BETWEEN', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'BETWEEN', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 2 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item value is less than left border value and type is OUTSIDE_OF', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'OUTSIDE_OF', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 1 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the same as the left border value and type is OUTSIDE_OF', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'OUTSIDE_OF', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 2 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item value is more than right border value and type is OUTSIDE_OF', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'OUTSIDE_OF', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 5 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the same as the right border value and type is OUTSIDE_OF', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'OUTSIDE_OF', {
      minValue: 2,
      maxValue: 4,
    });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 4 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item set to the same value and type is EQUAL', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'EQUAL', { value: 3 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 3 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the other value and type is EQUAL', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'EQUAL', { value: 2 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 3 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when item set to other same value and type is NOT_EQUAL', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'any', 'NOT_EQUAL', { value: 3 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 4 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when item set to the same value and type is NOT_EQUAL', () => {
    const items = [getSliderItem('mock-name-1'), getSliderItem('mock-name-2')];

    setCondition(items[0], items[1], 'all', 'NOT_EQUAL', { value: 2 });

    const answers: Answers = { '0': { answer: 1 }, '1': { answer: 2 } };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when the set components includes the value and type is INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[0], items[1], 'any', 'INCLUDES_OPTION', {
      optionValue: '2',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 3]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return true when the set components includes the next valid value and type is INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[0], items[1], 'all', 'INCLUDES_OPTION', {
      optionValue: '3',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 3]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(true);
  });

  it('Should return false when the set components does not include the value and type is INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[0], items[1], 'all', 'INCLUDES_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 3]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return false when the set components does not include the other wrong value and type is INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[0], items[1], 'all', 'INCLUDES_OPTION', {
      optionValue: '4',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 3]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(0);

    expect(result).toEqual(false);
  });

  it('Should return true when the set components does not include the value and type is NOT_INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[1], items[0], 'any', 'NOT_INCLUDES_OPTION', {
      optionValue: '5',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 5]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(1);

    expect(result).toEqual(true);
  });

  it('Should return false when the set components include the value and type is NOT_INCLUDES_OPTION', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[1], items[0], 'any', 'NOT_INCLUDES_OPTION', {
      optionValue: '1',
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 5]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(1);

    expect(result).toEqual(false);
  });

  it('Should return false when type is NOT_INCLUDES_OPTION and match is "all" and 1st condition is not valid and the 2nd is valid', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[1], items[0], 'all', 'NOT_INCLUDES_OPTION', {
      optionValue: '1',
    });

    items[1].conditionalLogic!.conditions.push({
      activityItemName: items[0].name!,
      type: 'NOT_INCLUDES_OPTION',
      payload: {
        optionValue: '3',
      },
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 5]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(1);

    expect(result).toEqual(false);
  });

  it('Should return true when type is NOT_INCLUDES_OPTION and match is "any" and 1st condition is not valid and the 2nd is valid', () => {
    const items = getCheckboxItems(['mock-name-1', 'mock-name-2']);

    setCondition(items[1], items[0], 'any', 'NOT_INCLUDES_OPTION', {
      optionValue: '1',
    });

    items[1].conditionalLogic!.conditions.push({
      activityItemName: items[0].name!,
      type: 'NOT_INCLUDES_OPTION',
      payload: {
        optionValue: '3',
      },
    });

    const answers: Answers = {
      '0': { answer: getCheckboxResponse([1, 2]) },
      '1': { answer: getCheckboxResponse([2, 5]) },
    };

    const { isItemVisible } = PipelineVisibilityChecker(items, answers);

    const result = isItemVisible(1);

    expect(result).toEqual(true);
  });
});
