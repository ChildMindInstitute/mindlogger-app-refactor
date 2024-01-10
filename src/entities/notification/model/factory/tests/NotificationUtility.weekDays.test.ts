import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

const mockUtilityProps = (utility: NotificationUtility, currentDay: Date) => {
  const now = new Date(currentDay);

  now.setHours(15);
  now.setMinutes(30);

  //@ts-ignore
  utility.now = new Date(now);
};

describe('NotificationUtility: weekdays property tests.', () => {
  it('Should return 15 weekdays days when today is Sat, Jan 6', () => {
    const today = new Date(2024, 0, 6);

    const utility = new NotificationUtility({}, AppletId);

    mockUtilityProps(utility, today);

    const weekDaysIndexes = utility.weekDays.map(x => x.getDay());

    expect(utility.weekDays.length).toEqual(15);

    expect(weekDaysIndexes).toEqual([
      1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5,
    ]);
  });

  it('Should return weekdays where the first day is Monday, Jan 1 and the last is Fri, Jan 19 when today is Sat, Jan 6', () => {
    const today = new Date(2024, 0, 6);

    const utility = new NotificationUtility({}, AppletId);

    mockUtilityProps(utility, today);

    const first = utility.weekDays[0];

    const last = utility.weekDays[utility.weekDays.length - 1];

    expect(first).toEqual(new Date(2024, 0, 1));

    expect(last).toEqual(new Date(2024, 0, 19));
  });

  it('Should return 15 weekdays days when today is Wed, Jan 3', () => {
    const today = new Date(2024, 0, 3);

    const utility = new NotificationUtility({}, AppletId);

    mockUtilityProps(utility, today);

    const weekDaysIndexes = utility.weekDays.map(x => x.getDay());

    expect(utility.weekDays.length).toEqual(15);

    expect(weekDaysIndexes).toEqual([
      3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2,
    ]);
  });

  it('Should return weekdays where the first day is Wed, Dec 27 and the last is Tue, Jan 16 when today is Wed, Jan 3', () => {
    const today = new Date(2024, 0, 3);

    const utility = new NotificationUtility({}, AppletId);

    mockUtilityProps(utility, today);

    const first = utility.weekDays[0];

    const last = utility.weekDays[utility.weekDays.length - 1];

    expect(first).toEqual(new Date(2023, 11, 27));

    expect(last).toEqual(new Date(2024, 0, 16));
  });
});
