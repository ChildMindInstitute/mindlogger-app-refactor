import { HourMinute } from '../../types';
import {
  areDatesEqual,
  buildDateFromDto,
  buildDateTimeFromDto,
  convertToDayMonthYear,
  convertToTimeOnNoun,
  formatToDtoDate,
  formatToDtoTime,
  getDiff,
  getMsFromHours,
  getMsFromMinutes,
  getMsFromSeconds,
  isSourceBiggerOrEqual,
  isSourceLess,
  isTimeInInterval,
} from '../dateTime';

describe('Function getMsFromHours', () => {
  it('should return correct milliseconds number', () => {
    const hours = 1;
    const fakeResult = 3600000;

    const result = getMsFromHours(hours);

    expect(result).toBe(fakeResult);
  });
});

describe('Function getMsFromMinutes', () => {
  it('should return correct milliseconds number', () => {
    const minutes = 1;
    const fakeResult = 60000;

    const result = getMsFromMinutes(minutes);

    expect(result).toBe(fakeResult);
  });
});

describe('Function getMsFromSeconds', () => {
  it('should return correct milliseconds number', () => {
    const seconds = 1;
    const fakeResult = 1000;

    const result = getMsFromSeconds(seconds);

    expect(result).toBe(fakeResult);
  });
});

describe('Function formatToDtoDate', () => {
  it('should return correct formatted date string from date object', () => {
    const date = new Date(0);
    const fakeResult = '1970-01-01';

    const result = formatToDtoDate(date);

    expect(result).toBe(fakeResult);
  });

  it('should return correct formatted date string from number', () => {
    const date = 0;
    const fakeResult = '1970-01-01';

    const result = formatToDtoDate(date);

    expect(result).toBe(fakeResult);
  });
});

describe('Function formatToDtoTime', () => {
  it('should return correct formatted time string from date object not including seconds', () => {
    const date = new Date('1995-12-17T03:24:00');
    const fakeResult = '03:24';

    const result = formatToDtoTime(date);

    expect(result).toBe(fakeResult);
  });

  it('should return correct formatted time string from date object including seconds', () => {
    const date = new Date('1995-12-17T03:24:00');
    const fakeResult = '03:24:00';

    const result = formatToDtoTime(date, true);

    expect(result).toBe(fakeResult);
  });

  it('should return correct formatted time string from number not including seconds', () => {
    const date = 3605000;
    const fakeResult = '04:00';

    const result = formatToDtoTime(date);

    expect(result).toBe(fakeResult);
  });

  it('should return correct formatted time string from number including seconds', () => {
    const date = 3605000;
    const fakeResult = '04:00:05';

    const result = formatToDtoTime(date, true);

    expect(result).toBe(fakeResult);
  });
});

describe('Function convertToTimeOnNoun', () => {
  it('should return correct formatted time', () => {
    const fakeResult = { formattedDate: '3:00 AM' };
    const date = new Date(0);
    const result = convertToTimeOnNoun(date);

    expect(result.formattedDate).toBe(fakeResult.formattedDate);
  });

  it('should check midnight case', () => {
    const date = new Date('1995-12-17T00:00:00');
    const result = convertToTimeOnNoun(date);
    const fakeTranslationKey = 'applet_list_component:midnight';

    expect(result.translationKey).toBe(fakeTranslationKey);
  });
});

describe('Function getDiff', () => {
  it('should return correct time difference in ms', () => {
    const toDate: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const fromDate: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const fakeDiff = 60000;

    const result = getDiff(fromDate, toDate);

    expect(result).toBe(fakeDiff);
  });
});

describe('Function isSourceLess', () => {
  it('should return if source time is less', () => {
    const timeSource: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const timeTarget: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const result = isSourceLess(timeSource, timeTarget);

    expect(result).toBe(false);
  });
});

describe('Function isSourceBiggerOrEqual', () => {
  it('should return if source time is more or equal', () => {
    const timeSource: HourMinute = {
      hours: 1,
      minutes: 1,
    };

    const timeTarget: HourMinute = {
      hours: 1,
      minutes: 0,
    };

    const result = isSourceBiggerOrEqual(timeSource, timeTarget);

    expect(result).toBe(true);
  });
});

describe('Function isTimeInInterval', () => {
  it('should return if time in interval', () => {
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

    const result = isTimeInInterval(timeSource, intervalFrom, intervalTo);

    expect(result).toBe(true);
  });
});

describe('Function buildDateFromDto', () => {
  it('should return correct built date', () => {
    const dateString = '1995-12-17';
    const fakeResult = new Date('1995-12-17T00:00');
    const result = buildDateFromDto(dateString);

    expect(result?.toDateString()).toBe(fakeResult.toDateString());
  });

  it('should return null if there is no date', () => {
    const dateString = null;
    const result = buildDateFromDto(dateString);

    expect(result).toBe(null);
  });

  it('should return null in year is not correct', () => {
    const dateString = '9999-12-17';
    const result = buildDateFromDto(dateString);

    expect(result).toBe(null);
  });
});

describe('Function buildDateTimeFromDto', () => {
  it('should return correct built date-time', () => {
    const dateString = '1995-12-17';
    const timeString = '00:00:00';
    const fakeResult = new Date('1995-12-17T00:00:00');
    const result = buildDateTimeFromDto(dateString, timeString);

    expect(result?.toDateString()).toBe(fakeResult.toDateString());
  });
});

describe('Function areDatesEqual', () => {
  it('should compare equal dates correctly', () => {
    const fakeDateOne = new Date('1995-12-17T00:00:00');
    const fakeDateTwo = new Date('1995-12-17T00:00:00');
    const result = areDatesEqual(fakeDateOne, fakeDateTwo);

    expect(result).toBe(true);
  });
});

describe('Function convertToDayMonthYear', () => {
  it('should build correct date object', () => {
    const fakeDateOne = new Date('1995-12-17T00:00:00');

    const result = convertToDayMonthYear(fakeDateOne);

    expect(result.day).toBe(17);
    expect(result.month).toBe(12);
    expect(result.year).toBe(1995);
  });
});
