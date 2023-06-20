export type Response = {
  timestamp: number;
  stimPos: number[];
  userPos: number[];
  targetPos: number[];
  lambda: number;
  score: number;
  lambdaSlope: number;
};

export type StabilityTrackerResponse = {
  score: number;
  // maxLambda: number;
  responses: Response[];
};

export enum TargetInCircleStatus {
  IN_OUTER_CIRCLE = 'inOuterCircle',
  IN_INNER_CIRCLE = 'inInnerCircle',
  OUT_OF_CIRCLES = 'outOfCircles',
}

export type Coordinate = [number, number];

export type BonusMultiplier = 0 | 1 | 2;
