import {
  AvailabilityType,
  PeriodicityType,
} from '@app/abstract/lib/types/event';
import { ISvgFileManager } from '@app/entities/drawer/lib/utils/ISvgFileManager';
import { getDefaultSvgFileManager } from '@app/entities/drawer/lib/utils/svgFileManagerInstance';
import { ScheduleEvent } from '@app/entities/event/lib/types/event';
import { IScheduledDateCalculator } from '@app/entities/event/model/operations/IScheduledDateCalculator';
import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import { Answers } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import {
  fillOptionsForRadio,
  getDrawerItem,
  getDrawerResponse,
  getEmptyRadioItem,
  getSliderItem,
  getSplashItem,
  getTextInputItem,
  getTutorialItem,
} from '@app/features/pass-survey/model/tests/testHelpers';

import { mapAnswersToDto } from '../mappers';
import {
  createSvgFiles,
  fillNullsForHiddenItems,
  getItemIds,
  getScheduledDate,
  getUserIdentifier,
} from '../operations';

const getMockEvent = (): ScheduleEvent => {
  return {
    availability: {
      allowAccessBeforeFromTime: false,
      endDate: null,
      startDate: null,
      timeFrom: null,
      timeTo: null,
      periodicityType: PeriodicityType.Always,
      availabilityType: AvailabilityType.AlwaysAvailable,
      oneTimeCompletion: false,
    },
    selectedDate: null,
    id: 'mock-event-id-1',
    entityId: 'mock-entity-id-1',
    scheduledAt: null,
    notificationSettings: {} as any,
    timers: {
      idleTimer: null,
      timer: null,
    },
  };
};

describe('Test survey operations', () => {
  let mockNow: Date;
  let calculator: IScheduledDateCalculator;
  let calculateSpy: jest.SpyInstance;

  let svgFileManager: ISvgFileManager;
  let writeFileSpy: jest.SpyInstance;

  beforeEach(() => {
    mockNow = new Date(2013, 5, 8, 0, 0, 0, 0);

    calculator = getDefaultScheduledDateCalculator();
    calculateSpy = jest.spyOn(calculator, 'calculate').mockReturnValue(mockNow);

    svgFileManager = getDefaultSvgFileManager();
    writeFileSpy = jest
      .spyOn(svgFileManager, 'writeFile')
      .mockResolvedValue(undefined);
  });

  it('"getScheduledDate" should return undefined when availabilityType is AlwaysAvailable', () => {
    const event = getMockEvent();

    const result = getScheduledDate(calculator, event);

    expect(calculateSpy).toBeCalledTimes(0);

    expect(result).toEqual(undefined);
  });

  const periodicityTypes = [
    PeriodicityType.Daily,
    PeriodicityType.Monthly,
    PeriodicityType.Once,
    PeriodicityType.Weekdays,
    PeriodicityType.Weekly,
  ];

  periodicityTypes.forEach(periodicity => {
    it(`"getScheduledDate" should return undefined when periodicity is ${periodicity}`, () => {
      const event = getMockEvent();

      event.availability.availabilityType = AvailabilityType.ScheduledAccess;
      event.availability.periodicityType = periodicity;

      const result = getScheduledDate(calculator, event);

      expect(calculateSpy).toBeCalledTimes(1);

      expect(result).toEqual(mockNow.getTime());
    });
  });

  it('"getUserIdentifier" should return first user identifier (text response)', () => {
    const items = [
      getSliderItem('item-name-1', 'item-id-1'),
      getSliderItem('item-name-2', 'item-id-2'),
      getTextInputItem('item-id-3'),
      getTextInputItem('item-id-4'),
    ];

    const answer1 = { answer: '1' };
    const answer2 = { answer: '5' };
    const answer3 = { answer: 'mock-identity' };
    const answer4 = { answer: 'mock-identity-2' };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
      '2': answer3,
      '3': answer4,
    };

    const result = getUserIdentifier(items, answers);

    expect(result).toEqual('mock-identity');
  });

  it('"getUserIdentifier" should return first user identifier (radio response)', () => {
    const items = [
      getSliderItem('item-name-1', 'item-id-1'),
      getSliderItem('item-name-2', 'item-id-2'),
      fillOptionsForRadio(getEmptyRadioItem('item-id-3')),
      getTextInputItem('item-id-4'),
    ];

    const answer1 = { answer: '1' };
    const answer2 = { answer: '5' };
    const answer3 = {
      answer: {
        id: 'mock-id-3',
        alert: { message: 'mock-alert-3' },
        text: 'mock-text-3',
        score: 30,
        value: 3,
        color: null,
        image: null,
        isHidden: false,
        tooltip: null,
      },
    };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
      '2': answer3,
    };

    const result = getUserIdentifier(items, answers);

    expect(result).toEqual('mock-text-3');
  });

  it('"getUserIdentifier" should return undefined if no items with response idenfier flag', () => {
    const items = [
      getSliderItem('item-name-1', 'item-id-1'),
      getSliderItem('item-name-2', 'item-id-2'),
    ];

    const answer1 = { answer: '1' };
    const answer2 = { answer: '5' };

    const answers: Answers = {
      '0': answer1,
      '1': answer2,
    };

    const result = getUserIdentifier(items, answers);

    expect(result).toEqual(undefined);
  });

  it('"getItemIds" should return items identifiers excluding the ones that cannot have answer', () => {
    const items = [
      getSplashItem('item-id-1'),
      getTextInputItem('item-id-2'),
      getSplashItem('item-id-3'),
      getSliderItem('item-name-4', 'item-id-4'),
      getSliderItem('item-name-5', 'item-id-5'),
      getTutorialItem('item-id-6'),
    ];

    const result = getItemIds(items);

    expect(result).toEqual(['item-id-2', 'item-id-4', 'item-id-5']);
  });

  it('"fillNullsForHiddenItems" should return items with filled nulls', () => {
    const items = [
      getSliderItem('item-name-1', 'item-id-1'),
      getSliderItem('item-name-2', 'item-id-2'),
      getTextInputItem('item-id-3'),
    ];

    const answer1 = { answer: '1' };
    const answer2 = { answer: '5' };
    const answer3 = { answer: 'mock-identity' };

    const answers: Answers = {
      0: answer1,
      1: answer2,
      2: answer3,
    };

    const answerDtos = mapAnswersToDto(items, answers);

    const result = fillNullsForHiddenItems(
      ['item-id-1', 'item-id-2', 'item-id-3'],
      answerDtos,
      [
        {
          isHidden: true,
          itemId: 'item-id-1',
          type: 'Slider',
        },
        {
          isHidden: false,
          itemId: 'item-id-2',
          type: 'Slider',
        },
        {
          isHidden: false,
          itemId: 'item-id-3',
          type: 'TextInput',
        },
      ],
    );

    expect(result).toEqual({
      answers: [null, { value: '5' }, 'mock-identity'],
      itemIds: ['item-id-1', 'item-id-2', 'item-id-3'],
      itemTypes: ['Slider', 'Slider', 'TextInput'],
    });
  });

  it('"createSvgFiles" should call SvgFileManager.writeFile with svgStrings taken from answers', async () => {
    const items = [
      getSplashItem('item-id-1'),
      getDrawerItem('item-id-2'),
      getTextInputItem('item-id-3'),
      getDrawerItem('item-id-4'),
      getSliderItem('item-name-5', 'item-id-5'),
    ];

    const answer1 = { answer: null };
    const answer2 = { answer: getDrawerResponse(2) };
    const answer3 = { answer: 'mock-input-value-3' };
    const answer4 = { answer: getDrawerResponse(4) };
    const answer5 = { answer: '5' };

    const answers: Answers = {
      0: answer1,
      1: answer2,
      2: answer3,
      3: answer4,
      4: answer5,
    };

    await createSvgFiles(svgFileManager, items, answers);

    expect(writeFileSpy).toBeCalledTimes(2);
    expect(writeFileSpy.mock.calls).toEqual([
      [
        'mock-uri-2',
        '<svg height="202" width="102" preserveAspectRatio="xMidYMid meet"><polyline points="72.96296013726129,65.83333121405708 73.42592451307509,64.62962892320421"></polyline></svg>',
      ],
      [
        'mock-uri-4',
        '<svg height="204" width="104" preserveAspectRatio="xMidYMid meet"><polyline points="72.96296013726129,65.83333121405708 73.42592451307509,64.62962892320421"></polyline></svg>',
      ],
    ]);
  });
});
