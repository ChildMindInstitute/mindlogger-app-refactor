import { HourMinute } from '../../types';
import {
  areDatesEqual,
  buildDateFromDto,
  convertToDayMonthYear,
  convertToTimeOnNoun,
  getDiff,
  getMsFromHours,
  getMsFromMinutes,
  getMsFromSeconds,
  isSourceBiggerOrEqual,
  isSourceLess,
  isTimeInInterval,
} from '../dateTime';

describe('Test functions getMsFromHours and some similar', () => {
  it('getMsFromHours should return 3600000 when input is 1 hour', () => {
    const hours = 1;
    const expectedResult = 3600000;

    const result = getMsFromHours(hours);

    expect(result).toBe(expectedResult);
  });

  it('getMsFromMinutes should return 60000 when input us 1 minute', () => {
    const minutes = 1;
    const expectedResult = 60000;

    const result = getMsFromMinutes(minutes);

    expect(result).toBe(expectedResult);
  });

  it('getMsFromSeconds should return 1000 when input is 1 second', () => {
    const seconds = 1;
    const fakeResult = 1000;

    const result = getMsFromSeconds(seconds);

    expect(result).toBe(fakeResult);
  });

  it('getDiff should return 60000 when the difference in the inputs is 1 minute', () => {
    const toDate: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const fromDate: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const expectedDiff = 60000;

    const result = getDiff(fromDate, toDate);

    expect(result).toBe(expectedDiff);
  });
});

describe('Test function convertToTimeOnNoun', () => {
  it('Should return midnight string when input is "1995-12-17T00:00:00"', () => {
    const date = new Date('1995-12-17T00:00:00');

    const result = convertToTimeOnNoun(date);

    const expectedTranslationKey = 'applet_list_component:midnight';

    expect(result.translationKey).toBe(expectedTranslationKey);
  });
});

describe('Functions isSource Less/Bigger etc.', () => {
  it('isSourceLess should return false when source contains 1 minute more than target', () => {
    const timeSource: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const timeTarget: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const result = isSourceLess({ timeSource, timeTarget });

    expect(result).toBe(false);
  });

  it('isSourceBiggerOrEqual should return true when source contains 1 minute more than target', () => {
    const timeSource: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const timeTarget: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const result = isSourceBiggerOrEqual({ timeSource, timeTarget });

    expect(result).toBe(true);
  });

  it('isTimeInInterval should return true when timeSource is between intervalFrom and intervalTo', () => {
    const timeSource: HourMinute = {
      hours: 2,
      minutes: 1,
    };

    const intervalFrom: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const intervalTo: HourMinute = {
      hours: 5,
      minutes: 0,
    };

    const result = isTimeInInterval({
      timeToCheck: timeSource,
      intervalFrom,
      intervalTo,
      including: 'from',
    });

    expect(result).toBe(true);
  });
});

describe('Test function buildDateFromDto, buildDateTimeFromDto', () => {
  it('Should return date 1995-12-17 with seconds/minutes/hours set to 0 when input string is 1995-12-17', () => {
    const dateString = '1995-12-17';

    const result = buildDateFromDto(dateString);

    expect(result?.getHours()).toBe(0);
    expect(result?.getMinutes()).toBe(0);
    expect(result?.getSeconds()).toBe(0);
  });

  it('Should return null if there is no date', () => {
    const dateString = null;
    const result = buildDateFromDto(dateString);

    expect(result).toBe(null);
  });

  it('Should return null when year is not correct', () => {
    const dateString = '9999-12-17';
    const result = buildDateFromDto(dateString);

    expect(result).toBe(null);
  });
});

describe('Test function areDatesEqual', () => {
  it('Should return true when dates hour, minutes, seconds differ', () => {
    const dateOne = new Date('1995-12-17T01:02:03');
    const dateTwo = new Date('1995-12-17T04:05:06');
    const result = areDatesEqual(dateOne, dateTwo);

    expect(result).toBe(true);
  });
});

describe('Test function convertToDayMonthYear', () => {
  it('Should return correct object', () => {
    const fakeDateOne = new Date('1995-12-17T00:00:00');

    const result = convertToDayMonthYear(fakeDateOne);

    expect(result.day).toBe(17);
    expect(result.month).toBe(12);
    expect(result.year).toBe(1995);
  });
});
