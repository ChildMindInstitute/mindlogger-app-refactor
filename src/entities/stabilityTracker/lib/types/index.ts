export type Response = {
  timestamp: number;
  circlePosition: number[];
  userPosition: number[];
  targetPosition: number[];
  lambda: number;
  score: number;
  lambdaSlope: number;
};

export type StabilityTrackerResponse = {
  score: number;
  responses: Response[];
};

export enum TargetInCircleStatus {
  IN_OUTER_CIRCLE = 'inOuterCircle',
  IN_INNER_CIRCLE = 'inInnerCircle',
  OUT_OF_CIRCLES = 'outOfCircles',
}

export type Coordinate = [number, number];

export type BonusMultiplier = 0 | 1 | 2;
