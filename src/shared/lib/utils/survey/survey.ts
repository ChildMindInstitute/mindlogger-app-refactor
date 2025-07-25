import { isToday } from 'date-fns';

import { EntityPath } from '@app/abstract/lib/types/entity';
import {
  EntityProgression,
  EntityProgressionCompleted,
  EntityProgressionInProgress,
} from '@app/abstract/lib/types/entityProgress';

import { palette } from '../../constants/palette';
import { getNow } from '../dateTime';

type ColorModes = {
  dark: string;
  light: string;
};

export const invertColor = (
  hex: string,
  colorModes: ColorModes = {
    dark: palette.inverse_on_surface,
    light: palette.on_primary_container,
  },
) => {
  const RED_RATIO = 299;
  const GREEN_RATIO = 587;
  const BLUE_RATIO = 114;
  const hexColor = hex.replace('#', '');
  const red = parseInt(hexColor.substring(0, 2), 16);
  const green = parseInt(hexColor.substring(2, 4), 16);
  const blue = parseInt(hexColor.substring(4, 6), 16);
  const yiqColorSpaceValue =
    (red * RED_RATIO + green * GREEN_RATIO + blue * BLUE_RATIO) / 1000;
  return yiqColorSpaceValue >= 128 ? colorModes.light : colorModes.dark;
};

export const getSelectorColors = ({
  setPalette,
  color,
  selected,
}: {
  setPalette: boolean;
  color: string | null;
  selected: boolean;
}) => {
  const hasColor = setPalette && color;

  const bgColor = hasColor ? color : 'transparent';
  const contrastingColor = hasColor && invertColor(color);
  const contrastingSelectedColor = hasColor
    ? invertColor(color, {
        dark: palette.secondary_fixed_dim,
        light: palette.primary,
      })
    : palette.primary;

  const textColor = contrastingColor || palette.on_surface;
  const tooltipColor = contrastingColor || palette.on_surface_variant;
  const widgetColor = contrastingColor || palette.outline_variant;

  const selectedDefaultBgColor = selected
    ? palette.secondary_container
    : 'transparent';
  const selectedBgColor = hasColor ? bgColor : selectedDefaultBgColor;
  const selectedWidgetColor = selected ? contrastingSelectedColor : widgetColor;
  const selectedBorderColor = selected
    ? selectedWidgetColor
    : palette.surface_variant;

  return {
    hasColor,
    textColor,
    tooltipColor,
    bgColor: selectedBgColor,
    widgetColor: selectedWidgetColor,
    borderColor: selectedBorderColor,
  };
};

export const getEntityProgression = (
  appletId: string,
  entityId: string,
  eventId: string,
  targetSubjectId: string | null,
  entityProgressions: EntityProgression[],
): EntityProgression | undefined => {
  return entityProgressions.find(progression => {
    return (
      progression.appletId === appletId &&
      progression.entityId === entityId &&
      progression.eventId === eventId &&
      progression.targetSubjectId === targetSubjectId
    );
  });
};

export const isEntityProgressionInProgress = (
  progression: EntityProgression | undefined,
) => {
  return (
    progression?.status === 'in-progress' &&
    !(progression as never as EntityProgressionCompleted | undefined)
      ?.endedAtTimestamp
  );
};

export function isProgressionReadyForAutocompletion(
  path: EntityPath,
  entityProgressions: EntityProgression[],
) {
  const progression = getEntityProgression(
    path.appletId,
    path.entityId,
    path.eventId,
    path.targetSubjectId,
    entityProgressions,
  );

  if (!progression) {
    return false;
  }

  const inProgress = isEntityProgressionInProgress(progression);

  return (
    inProgress &&
    isEntityExpired(
      (progression as EntityProgressionInProgress).availableUntilTimestamp,
    )
  );
}

export const isEntityExpired = (availableTo: number | null | undefined) =>
  !!availableTo && getNow().getTime() > availableTo;

export const isProgressionCompletedToday = (
  progression: EntityProgression | null | undefined,
): boolean => {
  if (progression) {
    const completedProgression = progression as EntityProgressionCompleted;
    if (completedProgression.endedAtTimestamp) {
      const endAt = new Date(completedProgression.endedAtTimestamp);
      return isToday(endAt);
    } else {
      return false;
    }
  }
  return false;
};
