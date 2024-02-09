import { addDays, subDays } from 'date-fns';

import { AvailabilityType, PeriodicityType } from '@app/abstract/lib';
import { ScheduleEvent } from '@app/entities/notification/lib';
import { DatesFromTo } from '@app/shared/lib';

import { addTime, getEmptyEvent } from './testHelpers';
import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, now: Date) => {
  //@ts-ignore
  utility.now = new Date(now);
};

const setEventAsScheduled = (event: ScheduleEvent) => {
  event.availability.availabilityType = AvailabilityType.ScheduledAccess;
  event.availability.periodicityType = PeriodicityType.NotDefined;
};

describe('NotificationUtility: getAvailabilityInterval tests', () => {
  describe('Test current day events', () => {
    it('Should return dates interval within the event day with timeFrom/to set and equal to event timeFrom/to when allowAccessBeforeFromTime is false', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 20, minutes: 15 };

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);
      expectedFrom.setHours(15);
      expectedFrom.setMinutes(30);

      const expectedTo = new Date(eventDay);
      expectedTo.setHours(20);
      expectedTo.setMinutes(15);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });

    it('Should return dates interval within the event day with only timeTo set and equal to event timeTo when allowAccessBeforeFromTime is true', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 20, minutes: 15 };
      event.availability.allowAccessBeforeFromTime = true;

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);

      const expectedTo = new Date(eventDay);
      expectedTo.setHours(20);
      expectedTo.setMinutes(15);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });

    it('Should return dates interval within the event day with timeFrom equal to event timeFrom and timeTo set to 23:59 when allowAccessBeforeFromTime is false and event timeTo is 23:59', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 23, minutes: 59 };

      const eventDay = subDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);
      expectedFrom.setHours(15);
      expectedFrom.setMinutes(30);

      const expectedTo = new Date(eventDay);
      expectedTo.setHours(23);
      expectedTo.setMinutes(59);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });
  });

  describe('Test cross day event', () => {
    it('Should return dates interval where dateFrom is in event day and dateTo is start of the next day when allowAccessBeforeFromTime is false and event timeTo is 00:00', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 0, minutes: 0 };

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);
      expectedFrom.setHours(15);
      expectedFrom.setMinutes(30);

      let expectedTo = new Date(eventDay);
      expectedTo = addDays(expectedTo, 1);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });

    it('Should return dates interval where dateFrom is in event day and dateTo is in the next day when allowAccessBeforeFromTime is false', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 10, minutes: 35 };

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);
      expectedFrom.setHours(15);
      expectedFrom.setMinutes(30);

      let expectedTo = new Date(eventDay);
      expectedTo = addDays(expectedTo, 1);
      expectedTo.setHours(10);
      expectedTo.setMinutes(35);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });

    it('Should return dates interval where dateFrom is start of event day and dateTo is in the next day when allowAccessBeforeFromTime is true', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      setEventAsScheduled(event);
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 10, minutes: 35 };
      event.availability.allowAccessBeforeFromTime = true;

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);

      let expectedTo = new Date(eventDay);
      expectedTo = addDays(expectedTo, 1);
      expectedTo.setHours(10);
      expectedTo.setMinutes(35);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });
  });

  describe('Test always-available event', () => {
    it('Should return dates interval where dateFrom is start of eventDay and dateTo is end of eventDay', () => {
      const today = new Date(2024, 0, 3);
      const now = addTime({ hours: 15, minutes: 30 }, today);

      const utility = new NotificationUtility({}, AppletId);

      mockUtilityProps(utility, now);

      const event = getEmptyEvent();
      event.availability.availabilityType = AvailabilityType.AlwaysAvailable;
      event.availability.periodicityType = PeriodicityType.Always;
      event.availability.timeFrom = { hours: 15, minutes: 30 };
      event.availability.timeTo = { hours: 20, minutes: 15 };

      const eventDay = addDays(today, 3);

      const interval: DatesFromTo = utility.getAvailabilityInterval(eventDay, event);

      const expectedFrom = new Date(eventDay);

      const expectedTo = new Date(eventDay);
      expectedTo.setHours(23);
      expectedTo.setMinutes(59);
      expectedTo.setSeconds(59);

      expect(interval).toEqual({
        from: expectedFrom,
        to: expectedTo,
      });
    });
  });
});
