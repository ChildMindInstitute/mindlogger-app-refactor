import {
  getEntityProgression,
  invertColor,
  isEntityExpired,
  isEntityProgressionInProgress,
  isProgressionReadyForAutocompletion,
} from './survey';

describe('Test function invertColor', () => {
  it('should return darkerGrey color', () => {
    const hex = '#7FFFD4';

    const invertedColor = invertColor(hex);

    expect(invertedColor).toBe('#FFFFFF');
  });

  it('should return white color', () => {
    const hex = '#3355AA';

    const invertedColor = invertColor(hex);

    expect(invertedColor).toBe('#333333');
  });
});

describe('Test getEntityProgress', () => {
  it('Should return undefined when progress is empty object', () => {
    const result = getEntityProgression(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      null,
      [],
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains only appletId', () => {
    const result = getEntityProgression(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      null,
      [{ appletId: 'mock-applet-id-1' } as never],
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains appletId and entityId', () => {
    const result = getEntityProgression(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      null,
      [{ appletId: 'mock-applet-id-1', entityId: 'mock-entity-id-1' } as never],
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains appletId and entityId and other eventId ', () => {
    const result = getEntityProgression(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      null,
      [
        {
          appletId: 'mock-applet-id-1',
          entityId: 'mock-entity-id-1',
          eventId: 'mock-event-id-2',
        } as never,
      ],
    );

    expect(result).toEqual(undefined);
  });

  it('Should return payload when progress contains appletId and entityId and eventId with payload ', () => {
    const result = getEntityProgression(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      null,
      [
        {
          status: 'in-progress',
          appletId: 'mock-applet-id-1',
          entityType: 'activity',
          entityId: 'mock-entity-id-1',
          eventId: 'mock-event-id-1',
          targetSubjectId: null,
          startedAtTimestamp: 123,
          availableUntilTimestamp: null,
          submitId: 'mock-submit-id',
        },
      ],
    );

    expect(result).toHaveProperty('status', 'in-progress');
    expect(result).toHaveProperty('appletId', 'mock-applet-id-1');
    expect(result).toHaveProperty('entityType', 'activity');
    expect(result).toHaveProperty('entityId', 'mock-entity-id-1');
    expect(result).toHaveProperty('eventId', 'mock-event-id-1');
    expect(result).toHaveProperty('targetSubjectId', null);
    expect(result).toHaveProperty('startedAtTimestamp', 123);
    expect(result).toHaveProperty('availableUntilTimestamp', null);
  });
});

describe('Test isEntityInProgress', () => {
  it('Should return false return when input is undefined', () => {
    const result = isEntityProgressionInProgress(undefined);

    expect(result).toEqual(false);
  });

  it('Should return false return when input is object with entAt equal to specified value', () => {
    const result = isEntityProgressionInProgress({
      status: 'completed',
      appletId: 'mock-applet-id-1',
      entityType: 'activity',
      entityId: 'mock-entity-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      availableUntilTimestamp: null,
      startedAtTimestamp: 123,
      endedAtTimestamp: 456,
      submitId: 'mock-submit-id',
    });

    expect(result).toEqual(false);
  });

  it('Should return true return when input is object with entAt equal to null', () => {
    const result = isEntityProgressionInProgress({
      status: 'in-progress',
      appletId: 'mock-applet-id-1',
      entityType: 'activity',
      entityId: 'mock-entity-id-1',
      eventId: 'mock-event-id-1',
      targetSubjectId: null,
      availableUntilTimestamp: null,
      startedAtTimestamp: 123,
      submitId: 'mock-submit-id',
    });

    expect(result).toEqual(true);
  });
});

describe('Test isEntityExpired', () => {
  it('Should return false when input is null', () => {
    const result = isEntityExpired(null);

    expect(result).toEqual(false);
  });

  it('Should return false when input is undefined', () => {
    const result = isEntityExpired(undefined);

    expect(result).toEqual(false);
  });

  it('Should return false when input is greater than date now', () => {
    const input = Date.now() + 10000;

    const result = isEntityExpired(input);

    expect(result).toEqual(false);
  });

  it('Should return true when input is less than date now', () => {
    const input = Date.now() - 10000;

    const result = isEntityExpired(input);

    expect(result).toEqual(true);
  });
});

describe('Test isReadyForAutocompletion', () => {
  it('Should return false when no progress record', () => {
    const result = isProgressionReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
        targetSubjectId: null,
      },
      [],
    );

    expect(result).toEqual(false);
  });

  it('Should return false when progress record exists and entity is completed', () => {
    const result = isProgressionReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
        targetSubjectId: null,
      },
      [
        {
          status: 'completed',
          appletId: 'mock-applet-id-1',
          entityType: 'activity',
          entityId: 'mock-entity-id-1',
          eventId: 'mock-event-id-1',
          targetSubjectId: null,
          availableUntilTimestamp: null,
          startedAtTimestamp: 12000034,
          endedAtTimestamp: 1234567,
          submitId: 'mock-submit-id',
        },
      ],
    );

    expect(result).toEqual(false);
  });

  it('Should return false when entity is in progress and availableTo is is greater than now date', () => {
    const result = isProgressionReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
        targetSubjectId: null,
      },
      [
        {
          status: 'in-progress',
          appletId: 'mock-applet-id-1',
          entityType: 'activity',
          entityId: 'mock-entity-id-1',
          eventId: 'mock-event-id-1',
          targetSubjectId: null,
          availableUntilTimestamp: Date.now() + 10000,
          startedAtTimestamp: 12000034,
          submitId: 'mock-submit-id',
        },
      ],
    );

    expect(result).toEqual(false);
  });

  it('Should return true when entity is in progress and availableTo is is less than now date', () => {
    const result = isProgressionReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
        targetSubjectId: null,
      },
      [
        {
          status: 'in-progress',
          appletId: 'mock-applet-id-1',
          entityType: 'activity',
          entityId: 'mock-entity-id-1',
          eventId: 'mock-event-id-1',
          targetSubjectId: null,
          availableUntilTimestamp: Date.now() - 10000,
          startedAtTimestamp: 12000034,
          submitId: 'mock-submit-id',
        },
      ],
    );

    expect(result).toEqual(true);
  });
});
