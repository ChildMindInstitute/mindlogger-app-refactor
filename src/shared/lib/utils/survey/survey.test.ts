import { ActivityPipelineType } from '@app/abstract/lib';

import {
  getEntityProgress,
  invertColor,
  isEntityExpired,
  isEntityInProgress,
  isReadyForAutocompletion,
} from './survey';
import { colors } from '../../constants';

describe('Test function invertColor', () => {
  it('should return darkerGrey color', () => {
    const hex = '#3355AA';

    const invertedColor = invertColor(hex);

    expect(invertedColor).toBe(colors.darkerGrey);
  });

  it('should return white color', () => {
    const hex = '#7FFFD4';

    const invertedColor = invertColor(hex);

    expect(invertedColor).toBe(colors.white);
  });
});

describe('Test getEntityProgress', () => {
  it('Should return undefined when progress is empty object', () => {
    const result = getEntityProgress(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      {},
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains only appletId', () => {
    const result = getEntityProgress(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      { 'mock-applet-id-1': {} },
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains appletId and entityId', () => {
    const result = getEntityProgress(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      { 'mock-applet-id-1': { 'mock-entity-id-1': {} } },
    );

    expect(result).toEqual(undefined);
  });

  it('Should return undefined when progress contains appletId and entityId and other eventId ', () => {
    const result = getEntityProgress(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      {
        'mock-applet-id-1': {
          'mock-entity-id-1': { 'mock-event-id-2': {} as any },
        },
      },
    );

    expect(result).toEqual(undefined);
  });

  it('Should return payload when progress contains appletId and entityId and eventId with payload ', () => {
    const result = getEntityProgress(
      'mock-applet-id-1',
      'mock-entity-id-1',
      'mock-event-id-1',
      {
        'mock-applet-id-1': {
          'mock-entity-id-1': {
            'mock-event-id-1': {
              type: ActivityPipelineType.Regular,
              availableTo: null,
              startAt: 123,
              endAt: null,
            },
          },
        },
      },
    );

    expect(result).toEqual({
      availableTo: null,
      endAt: null,
      startAt: 123,
      type: 1,
    });
  });
});

describe('Test isEntityInProgress', () => {
  it('Should return false return when input is undefined', () => {
    const result = isEntityInProgress(undefined);

    expect(result).toEqual(false);
  });

  it('Should return false return when input is object with entAt equal to specified value', () => {
    const result = isEntityInProgress({
      type: ActivityPipelineType.Regular,
      availableTo: null,
      startAt: 123,
      endAt: 456,
    });

    expect(result).toEqual(false);
  });

  it('Should return true return when input is object with entAt equal to null', () => {
    const result = isEntityInProgress({
      type: ActivityPipelineType.Regular,
      availableTo: null,
      startAt: 123,
      endAt: null,
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
    const result = isReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
      },
      {},
    );

    expect(result).toEqual(false);
  });

  it('Should return false when progress record exists and entity is completed', () => {
    const result = isReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
      },
      {
        'mock-applet-id-1': {
          'mock-entity-id-1': {
            'mock-event-id-1': {
              type: ActivityPipelineType.Regular,
              availableTo: null,
              startAt: 12000034,
              endAt: 1234567,
            },
          },
        },
      },
    );

    expect(result).toEqual(false);
  });

  it('Should return false when entity is in progress and availableTo is is greater than now date', () => {
    const result = isReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
      },
      {
        'mock-applet-id-1': {
          'mock-entity-id-1': {
            'mock-event-id-1': {
              type: ActivityPipelineType.Regular,
              availableTo: Date.now() + 10000,
              startAt: 12000034,
              endAt: null,
            },
          },
        },
      },
    );

    expect(result).toEqual(false);
  });

  it('Should return true when entity is in progress and availableTo is is less than now date', () => {
    const result = isReadyForAutocompletion(
      {
        appletId: 'mock-applet-id-1',
        entityId: 'mock-entity-id-1',
        eventId: 'mock-event-id-1',
        entityType: 'regular',
      },
      {
        'mock-applet-id-1': {
          'mock-entity-id-1': {
            'mock-event-id-1': {
              type: ActivityPipelineType.Regular,
              availableTo: Date.now() - 10000,
              startAt: 12000034,
              endAt: null,
            },
          },
        },
      },
    );

    expect(result).toEqual(true);
  });
});
