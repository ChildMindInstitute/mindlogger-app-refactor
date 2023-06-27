type Match = 'any' | 'all';

export type ConditionalLogic = {
  match: Match;
  conditions: Array<Condition>;
};

type Condition =
  | IncludesOptionCondition
  | NotIncludesOptionCondition
  | EqualToOptionCondition
  | NotEqualToOptionCondition
  | GreaterThanCondition
  | LessThanCondition
  | EqualCondition
  | NotEqualCondition
  | BetweenCondition
  | OutsideOfCondition;

type IncludesOptionCondition = {
  activityItemName: string;
  type: 'INCLUDES_OPTION';
  payload: {
    optionId: string;
  };
};

type NotIncludesOptionCondition = {
  activityItemName: string;
  type: 'NOT_INCLUDES_OPTION';
  payload: {
    optionId: string;
  };
};

type EqualToOptionCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_OPTION';
  payload: {
    optionId: string;
  };
};

type NotEqualToOptionCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_OPTION';
  payload: {
    optionId: string;
  };
};

type GreaterThanCondition = {
  activityItemName: string;
  type: 'GREATER_THAN';
  payload: {
    value: number;
  };
};

type LessThanCondition = {
  activityItemName: string;
  type: 'LESS_THAN';
  payload: {
    value: number;
  };
};

type EqualCondition = {
  activityItemName: string;
  type: 'EQUAL';
  payload: {
    value: number;
  };
};

type NotEqualCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL';
  payload: {
    value: number;
  };
};

type BetweenCondition = {
  activityItemName: string;
  type: 'BETWEEN';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

type OutsideOfCondition = {
  activityItemName: string;
  type: 'OUTSIDE_OF';
  payload: {
    minValue: number;
    maxValue: number;
  };
};
