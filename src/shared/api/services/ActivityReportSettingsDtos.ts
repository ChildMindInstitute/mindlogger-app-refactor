type ReportType = 'score' | 'section';

type CalculationType = 'average' | 'percentage' | 'sum';

type MatchType = 'all' | 'any';

const ScoreReportScoringType = ['score', 'raw_score'] as const;

type ScoreReportScoringType = (typeof ScoreReportScoringType)[number];

type ConditionDto =
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

type ScoreConditionalLogicDto = {
  id: string;
  name: string;
  flagScore: boolean;
  match: MatchType;
  conditions: Array<ConditionDto>;
};

export type ReportDto = {
  id: string;
  calculationType: CalculationType;
  itemsScore: Array<string>;
  name: string;
  type: ReportType;
  conditionalLogic: Array<ScoreConditionalLogicDto>;
  /** Whether to show raw score or T scores in the report */
  scoringType: ScoreReportScoringType;
  /** The name of a subscale to use for a lookup table, if `scoringType` is set to "score" */
  subscaleName?: string;
};
