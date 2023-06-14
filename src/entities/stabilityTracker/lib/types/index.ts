export type TestIndex = 0 | 1;

export type TutorialPayload = Array<string>;

export type DeviceTutorials = Record<TestIndex, TutorialPayload>;

export type StabilityTrackerResponse = {
  score: number;
};

export enum TargetInCircleStatus {
  IN_OUTER_CIRCLE = 'inOuterCircle',
  IN_INNER_CIRCLE = 'inInnerCircle',
  OUT_OF_CIRCLES = 'outOfCircles',
}

export type Coordinate = [number, number];

export type BonusMultiplier = 0 | 1 | 2;
