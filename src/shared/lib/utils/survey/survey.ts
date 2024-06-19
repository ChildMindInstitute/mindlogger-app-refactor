import { isToday } from 'date-fns';

import {
  EntityPath,
  StoreProgress,
  StoreProgressPayload,
} from '@app/abstract/lib';
import { colors } from '@shared/lib/constants';

import { getNow } from '../dateTime';

export const invertColor = (hex: string) => {
  const RED_RATIO = 299;
  const GREEN_RATIO = 587;
  const BLUE_RATIO = 114;
  const hexColor = hex.replace('#', '');
  const red = parseInt(hexColor.substring(0, 2), 16);
  const green = parseInt(hexColor.substring(2, 4), 16);
  const blue = parseInt(hexColor.substring(4, 6), 16);
  const yiqColorSpaceValue =
    (red * RED_RATIO + green * GREEN_RATIO + blue * BLUE_RATIO) / 1000;
  return yiqColorSpaceValue >= 128 ? colors.darkerGrey : colors.white;
};

export const getEntityProgress = (
  appletId: string,
  entityId: string,
  eventId: string,
  allProgresses: StoreProgress,
): StoreProgressPayload | undefined =>
  allProgresses[appletId]?.[entityId]?.[eventId];

export const isEntityInProgress = (
  payload: StoreProgressPayload | undefined,
): boolean => !!payload && !payload.endAt;

export function isReadyForAutocompletion(
  path: EntityPath,
  allProgresses: StoreProgress,
) {
  const progress = getEntityProgress(
    path.appletId,
    path.entityId,
    path.eventId,
    allProgresses,
  );

  if (!progress) {
    return false;
  }

  const inProgress = isEntityInProgress(progress);

  return inProgress && isEntityExpired(progress.availableTo);
}

export const isEntityExpired = (availableTo: number | null | undefined) =>
  !!availableTo && getNow().getTime() > availableTo;

export const isCompletedToday = (
  record: StoreProgressPayload | null | undefined,
) => record && record.endAt && isToday(record.endAt);
