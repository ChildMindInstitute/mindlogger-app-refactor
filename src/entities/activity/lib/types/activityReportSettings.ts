type ReportType = 'score' | 'section';

type CalculationType = 'average' | 'percentage' | 'sum';

type MatchType = 'all' | 'any';

type Condition =
  | GreaterThanCondition
  | LessThanCondition
  | EqualCondition
  | NotEqualCondition
  | BetweenCondition
  | OutsideOfCondition;

type GreaterThanCondition = {
  itemName: string;
  type: 'GREATER_THAN';
  payload: {
    value: number;
  };
};

type LessThanCondition = {
  itemName: string;
  type: 'LESS_THAN';
  payload: {
    value: number;
  };
};

type EqualCondition = {
  itemName: string;
  type: 'EQUAL';
  payload: {
    value: number;
  };
};

type NotEqualCondition = {
  itemName: string;
  type: 'NOT_EQUAL';
  payload: {
    value: number;
  };
};

type BetweenCondition = {
  itemName: string;
  type: 'BETWEEN';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

type OutsideOfCondition = {
  itemName: string;
  type: 'OUTSIDE_OF';
  payload: {
    minValue: number;
    maxValue: number;
  };
};

export type ScoreConditionalLogic = {
  id: string;
  name: string;
  flagScore: boolean;
  match: MatchType;
  conditions: Array<Condition>;
};

export type Report = {
  id: string;
  calculationType: CalculationType;
  includedItems: Array<string>;
  name: string;
  type: ReportType;
  conditionalLogic: Array<ScoreConditionalLogic>;
};
