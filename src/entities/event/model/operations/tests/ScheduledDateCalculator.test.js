import { addDays, startOfDay, subDays } from 'date-fns';

import ScheduledDateCalculator from '../ScheduledDateCalculator';

const now = new Date(2024, 0, 25);

describe('Test ScheduledDateCalculator', () => {
  let tempGetNow;

  beforeAll(() => {
    tempGetNow = ScheduledDateCalculator.getNow;
    ScheduledDateCalculator.getNow = jest.fn().mockReturnValue(new Date(now));
  });

  afterAll(() => {
    ScheduledDateCalculator.getNow = tempGetNow;
  });

  describe('Test Always Available events', () => {
    it('Should return today with time eq.to start of day or to timeFrom', () => {
      const eventAvailability = {
        availabilityType: 'AlwaysAvailable',
        periodicityType: 'ALWAYS',
        timeFrom: null,
        timeTo: null,
        startDate: null,
        endDate: null,
      };

      const scheduleEvent = {
        id: 'eventTestId',
        entityId: 'entityTestId',
        availability: eventAvailability,
        selectedDate: null,
        scheduledAt: null,
      };

      let resultDate = ScheduledDateCalculator.calculate(scheduleEvent, false);

      let expectedDate = startOfDay(now);

      expect(resultDate).toEqual(expectedDate);

      // sub-test 2 - with timeFrom
      eventAvailability.timeFrom = { hours: 16, minutes: 15 };

      resultDate = ScheduledDateCalculator.calculate(scheduleEvent, false);

      expectedDate = startOfDay(now);
      expectedDate.setHours(16);
      expectedDate.setMinutes(15);

      expect(resultDate).toEqual(expectedDate);
    });
  });

  describe('Test Once events', () => {
    const getOnceEvent = () => {
      const eventAvailability = {
        availabilityType: 'ScheduledAccess',
        periodicityType: 'ONCE',
        timeFrom: { hours: 14, minutes: 0 },
        timeTo: { hours: 18, minutes: 30 },
        startDate: null,
        endDate: null,
      };

      const scheduleEvent = {
        id: 'eventTestId',
        entityId: 'entityTestId',
        availability: eventAvailability,
        selectedDate: null,
        scheduledAt: null,
      };

      return scheduleEvent;
    };

    it('Should return null when selected date is in the past and earlier than yesterday', () => {
      const onceEvent = getOnceEvent();
      onceEvent.selectedDate = subDays(startOfDay(now), 2);

      const resultDate = ScheduledDateCalculator.calculate(onceEvent, false);

      expect(resultDate).toEqual(null);
    });

    it('Should return selectedDate when selected date is in the past and less than yesterday', () => {
      const onceEvent = getOnceEvent();
      onceEvent.selectedDate = subDays(startOfDay(now), 1);

      const resultDate = ScheduledDateCalculator.calculate(onceEvent, false);

      const expectedDate = new Date(onceEvent.selectedDate);
      expectedDate.setHours(onceEvent.availability.timeFrom.hours);
      expectedDate.setMinutes(onceEvent.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return tomorrow's day with timeFrom when selected date is tomorrow and timeFrom is set", () => {
      const onceEvent = getOnceEvent();
      onceEvent.selectedDate = addDays(startOfDay(now), 1);

      const resultDate = ScheduledDateCalculator.calculate(onceEvent, false);

      const expectedDate = addDays(startOfDay(now), 1);
      expectedDate.setHours(onceEvent.availability.timeFrom.hours);
      expectedDate.setMinutes(onceEvent.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return todays's start of day when selected date is today and time from is default", () => {
      const onceEvent = getOnceEvent();
      onceEvent.selectedDate = startOfDay(now);
      onceEvent.availability.timeFrom = { hours: 0, minutes: 0 };

      const resultDate = ScheduledDateCalculator.calculate(onceEvent, false);

      const expectedDate = startOfDay(now);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return todays's start of day with timeFrom when selected date is today and time from is set", () => {
      const onceEvent = getOnceEvent();
      onceEvent.selectedDate = startOfDay(now);
      onceEvent.availability.timeFrom = { hours: 16, minutes: 30 };

      const resultDate = ScheduledDateCalculator.calculate(onceEvent, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(16);
      expectedDate.setMinutes(30);

      expect(resultDate).toEqual(expectedDate);
    });
  });

  describe('Test Daily events', () => {
    const getDailyEvent = () => {
      const eventAvailability = {
        availabilityType: 'ScheduledAccess',
        periodicityType: 'DAILY',
        timeFrom: { hours: 14, minutes: 0 },
        timeTo: { hours: 18, minutes: 30 },
        startDate: null,
        endDate: null,
      };

      const scheduleEvent = {
        id: 'eventTestId',
        entityId: 'entityTestId',
        availability: eventAvailability,
        selectedDate: null,
        scheduledAt: null,
      };

      return scheduleEvent;
    };

    it("Should return today's start of day when current day is in valid dates window and timeFrom is default", () => {
      const event = getDailyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.availability.timeFrom = { hours: 0, minutes: 0 };

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return today's date with valid timeFrom when current day is in valid dates window and timeFrom is set", () => {
      const event = getDailyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return today's date with valid timeFrom when dateTo is today and timeFrom is set", () => {
      const event = getDailyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = startOfDay(now);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it("Should return today's date with valid timeFrom when dateFrom is today and timeFrom is set", () => {
      const event = getDailyEvent();
      event.availability.startDate = startOfDay(now);
      event.availability.endDate = addDays(startOfDay(now), 2);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return startDate with timeFrom when startDate is in future and timeFrom is set', () => {
      const event = getDailyEvent();
      event.availability.startDate = addDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 5);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = new Date(event.availability.startDate);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return endDate with timeFrom when endDate is in the past and timeFrom is set', () => {
      const event = getDailyEvent();
      event.availability.startDate = subDays(startOfDay(now), 5);
      event.availability.endDate = subDays(startOfDay(now), 2);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = new Date(event.availability.endDate);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });
  });

  describe('Test Weekly events', () => {
    const getWeeklyEvent = () => {
      const eventAvailability = {
        availabilityType: 'ScheduledAccess',
        periodicityType: 'WEEKLY',
        timeFrom: { hours: 14, minutes: 0 },
        timeTo: { hours: 18, minutes: 30 },
        startDate: null,
        endDate: null,
      };

      const scheduleEvent = {
        id: 'eventTestId',
        entityId: 'entityTestId',
        availability: eventAvailability,
        selectedDate: null,
        scheduledAt: null,
      };

      return scheduleEvent;
    };

    it("Should return today's start of day when selected day is today and is covered by start-end dates and timeFrom is reset", () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.availability.timeFrom = { hours: 0, minutes: 0 };
      event.selectedDate = startOfDay(now);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return today with timeFrom when selected day is today and covered by start-end dates and timeFrom is set', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.selectedDate = startOfDay(now);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return date today with timeFrom when selected day is today + or - 7 days and timeFrom is set and date start/end -/+ 2 days', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 2);
      event.selectedDate = addDays(startOfDay(now), 7);

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = startOfDay(now);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.selectedDate = subDays(startOfDay(now), 7);

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return a date equal to startDate with set/not set timeFrom when selected date is tomorrow and start/end dates are (today +1/+5 days)', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = addDays(startOfDay(now), 1);
      event.availability.endDate = addDays(startOfDay(now), 5);
      event.selectedDate = addDays(startOfDay(now), 1);

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      let expectedDate = addDays(startOfDay(now), 1);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expectedDate = addDays(startOfDay(now), 1);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return a date equal to endDate with set/not set timeFrom when selected date is yesterday and start/end dates are (today -5/-1 days)', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 5);
      event.availability.endDate = subDays(startOfDay(now), 1);
      event.selectedDate = subDays(startOfDay(now), 1);

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      let expectedDate = subDays(startOfDay(now), 1);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expectedDate = subDays(startOfDay(now), 1);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return (today - 3 days with timeFrom) when timeFrom is set and selected date is (today + 4 days) and start/end dates -/+ 10 days', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 10);
      event.availability.endDate = addDays(startOfDay(now), 10);
      event.selectedDate = addDays(startOfDay(now), 4);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = subDays(startOfDay(now), 3);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return (today - 4 days with timeFrom) when timeFrom is set and selected date is (today - 4 days) and start/end dates -/+ 10 days', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 10);
      event.availability.endDate = addDays(startOfDay(now), 10);
      event.selectedDate = subDays(startOfDay(now), 4);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = subDays(startOfDay(now), 4);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return (today + 3 days with timeFrom) when timeFrom is set and selected date is (today - 4 days) and startDate is (today -/+ 2 days)', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 10);
      event.selectedDate = subDays(startOfDay(now), 4);

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = addDays(subDays(startOfDay(now), 4), 7);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.startDate = addDays(startOfDay(now), 2);
      event.availability.endDate = addDays(startOfDay(now), 10);

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return null when selected date is (today - 1 days) and start/end date earlier than (today -1 day)', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = subDays(startOfDay(now), 6);
      event.availability.endDate = subDays(startOfDay(now), 3);
      event.selectedDate = subDays(startOfDay(now), 1);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(null);
    });

    it('Should return null when selected date is (today - 1 days) and start/end date (today +1/+5 day)', () => {
      const event = getWeeklyEvent();
      event.availability.startDate = addDays(startOfDay(now), 1);
      event.availability.endDate = addDays(startOfDay(now), 5);
      event.selectedDate = subDays(startOfDay(now), 1);

      const resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(null);
    });
  });

  describe('Test Weekdays events', () => {
    const getWeekdaysEvent = () => {
      const eventAvailability = {
        availabilityType: 'ScheduledAccess',
        periodicityType: 'WEEKDAYS',
        timeFrom: { hours: 14, minutes: 0 },
        timeTo: { hours: 18, minutes: 30 },
        startDate: null,
        endDate: null,
      };

      const scheduleEvent = {
        id: 'eventTestId',
        entityId: 'entityTestId',
        availability: eventAvailability,
        selectedDate: null,
        scheduledAt: null,
      };

      return scheduleEvent;
    };

    let tempGetNow;

    beforeEach(() => {
      tempGetNow = ScheduledDateCalculator.getNow;
    });

    afterEach(() => {
      jest.clearAllMocks();
      ScheduledDateCalculator.getNow = tempGetNow;
    });

    it('Should return Mon, Wed, Fri when getNow returns Mon, Wed, Fri accordingly and start-end dates are -/+ 30 days and timeFrom is reset or is set', () => {
      const event = getWeekdaysEvent();

      const monday = startOfDay(new Date(2023, 8, 25));
      const wednesday = startOfDay(new Date(2023, 8, 27));
      const friday = startOfDay(new Date(2023, 8, 29));

      event.availability.startDate = subDays(monday, 30);
      event.availability.endDate = addDays(monday, 30);
      event.availability.timeFrom = { hours: 0, minutes: 0 };

      let getNowMock = jest.fn(() => {
        return new Date(monday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(monday);

      event.availability.timeFrom = { hours: 15, minutes: 56 };

      getNowMock = jest.fn(() => {
        return new Date(wednesday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      resultDate = ScheduledDateCalculator.calculate(event, false);

      const expected = new Date(wednesday);
      expected.setHours(15);
      expected.setMinutes(56);

      expect(resultDate).toEqual(expected);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      getNowMock = jest.fn(() => {
        return new Date(friday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(friday);
    });

    it('Should return Fri when getNow returns Sat or Sun and start-end dates are -/+ 30 days and timeFrom is set or not set', () => {
      const event = getWeekdaysEvent();

      const friday = startOfDay(new Date(2023, 8, 29));
      const saturday = startOfDay(new Date(2023, 8, 30));
      const sunday = startOfDay(new Date(2023, 9, 1));

      event.availability.startDate = subDays(saturday, 30);
      event.availability.endDate = addDays(saturday, 30);

      let getNowMock = jest.fn(() => {
        return new Date(sunday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = new Date(friday);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };

      getNowMock = jest.fn(() => {
        return new Date(saturday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(friday);
    });

    it('Should return Wed when getNow returns Wed and startDate is Wed and endDate is (Wed + 30 days) and timeFrom is set or not set', () => {
      const event = getWeekdaysEvent();

      const wednesday = startOfDay(new Date(2023, 8, 27));

      event.availability.startDate = new Date(wednesday);
      event.availability.endDate = addDays(wednesday, 30);

      const getNowMock = jest.fn(() => {
        return new Date(wednesday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = new Date(wednesday);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };
      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(wednesday);
    });

    it('Should return Wed when getNow returns Wed and startDate is (Wed - 30 days) and endDate is Wed and timeFrom is set or not set', () => {
      const event = getWeekdaysEvent();

      const wednesday = startOfDay(new Date(2023, 8, 27));

      event.availability.startDate = new subDays(new Date(wednesday), 30);
      event.availability.endDate = new Date(wednesday);

      const getNowMock = jest.fn(() => {
        return new Date(wednesday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      const expectedDate = new Date(wednesday);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };
      resultDate = ScheduledDateCalculator.calculate(event, false);

      expect(resultDate).toEqual(wednesday);
    });

    it('Should return Mon, Oct 9 when getNow returns Wed, Sep, 27 and startDate is (Wed + 10 day) and endDate is (Wed + 30 days) and timeFrom is set or not set', () => {
      const event = getWeekdaysEvent();

      const wednesday = startOfDay(new Date(2023, 8, 27));

      event.availability.startDate = new addDays(new Date(wednesday), 10);
      event.availability.endDate = addDays(wednesday, 30);

      const getNowMock = jest.fn(() => {
        return new Date(wednesday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      let expectedDate = new Date(2023, 9, 9);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };
      resultDate = ScheduledDateCalculator.calculate(event, false);

      expectedDate = new Date(2023, 9, 9);
      expect(resultDate).toEqual(expectedDate);
    });

    it('Should return Fri, 15 when getNow returns Wed, 27 and startDate is (Wed - 30 day) and endDate is (Wed - 10 days) and timeFrom is set or not set', () => {
      const event = getWeekdaysEvent();

      const wednesday = startOfDay(new Date(2023, 8, 27));

      event.availability.startDate = new subDays(new Date(wednesday), 30);
      event.availability.endDate = subDays(wednesday, 10);

      const getNowMock = jest.fn(() => {
        return new Date(wednesday);
      });

      ScheduledDateCalculator.getNow = getNowMock;

      let resultDate = ScheduledDateCalculator.calculate(event, false);

      let expectedDate = new Date(2023, 8, 15);
      expectedDate.setHours(event.availability.timeFrom.hours);
      expectedDate.setMinutes(event.availability.timeFrom.minutes);

      expect(resultDate).toEqual(expectedDate);

      event.availability.timeFrom = { hours: 0, minutes: 0 };
      resultDate = ScheduledDateCalculator.calculate(event, false);

      expectedDate = new Date(2023, 8, 15);

      expect(resultDate).toEqual(expectedDate);
    });
  });
});
