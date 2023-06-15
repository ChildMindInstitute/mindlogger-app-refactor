import { TargetInCircleStatus, Coordinate, BonusMultiplier } from '../types';
export const generateTargetTrajectory = (
  durationMins: number,
  refreshDur = 0.033,
  padInSeconds = 0,
  centerPoint: number,
) => {
  const durationSecs = durationMins * 60 + padInSeconds;
  const numPoints = Math.ceil(durationSecs / refreshDur);

  return Array(numPoints).fill([centerPoint, centerPoint]);
};

export const computeDistance = (p1: Coordinate, p2: Coordinate) => {
  const xSquared = (p1[0] - p2[0]) * (p1[0] - p2[0]);
  const ySquared = (p1[1] - p2[1]) * (p1[1] - p2[1]);

  return xSquared + ySquared;
};

export const computeDxDt = (
  stimPos: Coordinate,
  userPos: Coordinate,
  lambdaVal: number,
  center: number,
) => {
  const changeRate = [0, 0];
  const deltaX = stimPos[0] - center + (userPos[0] - center);
  const deltaY = stimPos[1] - center + (userPos[1] - center);

  changeRate[0] = lambdaVal * deltaX;
  changeRate[1] = lambdaVal * deltaY;

  return changeRate;
};

export const getNewLambda = (
  currentLambda: number,
  currentTs: number,
  lambdaSlope: number,
  maxLambda: number,
) => {
  const lambdaValue = currentLambda + (currentTs / 1000) * lambdaSlope;

  if (maxLambda > 0 && lambdaValue >= maxLambda) {
    return maxLambda;
  }

  return lambdaValue;
};

export const isInBounds = (value: number, start: number, end: number) => {
  return value >= start && value <= end;
};

export const getScoreChange = (
  bonusMultiplier: BonusMultiplier,
  deltaTime: number,
): number => {
  return (bonusMultiplier * deltaTime) / 1000;
};

export const getBonusMultiplier = (
  stimToTargetDist2: number,
  innerStimRadius: number,
  outerStimRadius: number,
): BonusMultiplier => {
  if (stimToTargetDist2 < innerStimRadius * innerStimRadius) {
    return 2;
  }

  if (stimToTargetDist2 < outerStimRadius * outerStimRadius) {
    return 1;
  }

  return 0;
};

export const getDiskStatus = (
  circlePosition: Coordinate,
  targetPosition: Coordinate,
  innerCircleRadius: number,
  outerCircleRadius: number,
): TargetInCircleStatus => {
  const distance = computeDistance(circlePosition, targetPosition);

  if (distance === null) {
    return TargetInCircleStatus.OUT_OF_CIRCLES;
  }

  if (distance <= innerCircleRadius * innerCircleRadius) {
    return TargetInCircleStatus.IN_INNER_CIRCLE;
  }

  if (distance <= outerCircleRadius * outerCircleRadius) {
    return TargetInCircleStatus.IN_OUTER_CIRCLE;
  }

  return TargetInCircleStatus.OUT_OF_CIRCLES;
};
