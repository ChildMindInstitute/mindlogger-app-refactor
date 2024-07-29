import { NotificationUtility } from '../NotificationUtility';

const AppletId = 'e31c7468-4197-4ed1-a908-72af80d7765f';

describe('NotificationUtility: test corner cases, rest of small functions', () => {
  it('getRandomInt should return different values when call it several times and all they are less than 1000', () => {
    const utility = new NotificationUtility({}, AppletId);

    //@ts-expect-error
    const value1 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value2 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value3 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value4 = utility.getRandomInt(1000);
    //@ts-expect-error
    const value5 = utility.getRandomInt(1000);

    expect(
      value1 === value2 &&
        value1 === value3 &&
        value1 === value4 &&
        value1 === value5,
    ).toEqual(false);

    [value1, value2, value3, value4, value5].forEach(v =>
      expect(v).toBeLessThan(1000),
    );
  });
});
