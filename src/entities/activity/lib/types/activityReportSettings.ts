type ReportType = 'score' | 'section';

export type CalculationType = 'average' | 'percentage' | 'sum';

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

export const ScoreReportScoringType = ['score', 'raw_score'] as const;

export type ScoreReportScoringType = (typeof ScoreReportScoringType)[number];

export type Report = {
  id: string;
  calculationType: CalculationType;
  includedItems: Array<string>;
  name: string;
  type: ReportType;
  conditionalLogic: Array<ScoreConditionalLogic>;

  /** Whether to show raw score or T scores in the report */
  scoringType: ScoreReportScoringType;
  /** The name of a subscale to use for a lookup table, if `scoringType` is set to "score" */
  subscaleName?: string;
};
