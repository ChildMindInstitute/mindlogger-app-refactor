export type Match = 'any' | 'all';

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
  | OutsideOfCondition
  | GreaterThanDateCondition
  | LessThanDateCondition
  | EqualToDateCondition
  | NotEqualToDateCondition
  | BetweenDatesCondition
  | OutsideOfDatesCondition
  | GreaterThanTimeCondition
  | LessThanTimeCondition
  | EqualToTimeCondition
  | NotEqualToTimeCondition
  | BetweenTimesCondition
  | OutsideOfTimesCondition
  | GreaterThanTimeRangeCondition
  | LessThanTimeRangeCondition
  | EqualToTimeRangeCondition
  | NotEqualToTimeRangeCondition
  | BetweenTimesRangeCondition
  | OutsideOfTimesRangeCondition
  | GreaterThanSliderRowCondition
  | LessThanSliderRowCondition
  | EqualToSliderRowCondition
  | NotEqualToSliderRowCondition
  | BetweenSliderRowCondition
  | OutsideOfSliderRowCondition
  | EqualToRowOptionCondition
  | NotEqualToRowOptionCondition
  | IncludesRowOptionCondition
  | NotIncludesRowOptionCondition;

export type ConditionType = Condition['type'];

type EqualToRowOptionCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_ROW_OPTION';
  payload: {
    optionValue: string;
    rowIndex: number;
  };
};

type NotEqualToRowOptionCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_ROW_OPTION';
  payload: {
    optionValue: string;
    rowIndex: number;
  };
};

type IncludesRowOptionCondition = {
  activityItemName: string;
  type: 'INCLUDES_ROW_OPTION';
  payload: {
    optionValue: string;
    rowIndex: number;
  };
};

type NotIncludesRowOptionCondition = {
  activityItemName: string;
  type: 'NOT_INCLUDES_ROW_OPTION';
  payload: {
    optionValue: string;
    rowIndex: number;
  };
};

type EqualToSliderRowCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_SLIDER_ROWS';
  payload: {
    value: number;
    rowIndex: number;
  };
};

type NotEqualToSliderRowCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_SLIDER_ROWS';
  payload: {
    value: number;
    rowIndex: number;
  };
};

type GreaterThanSliderRowCondition = {
  activityItemName: string;
  type: 'GREATER_THAN_SLIDER_ROWS';
  payload: {
    value: number;
    rowIndex: number;
  };
};

type LessThanSliderRowCondition = {
  activityItemName: string;
  type: 'LESS_THAN_SLIDER_ROWS';
  payload: {
    value: number;
    rowIndex: number;
  };
};

type BetweenSliderRowCondition = {
  activityItemName: string;
  type: 'BETWEEN_SLIDER_ROWS';
  payload: {
    minValue: number;
    maxValue: number;
    rowIndex: number;
  };
};

type OutsideOfSliderRowCondition = {
  activityItemName: string;
  type: 'OUTSIDE_OF_SLIDER_ROWS';
  payload: {
    minValue: number;
    maxValue: number;
    rowIndex: number;
  };
};

type IncludesOptionCondition = {
  activityItemName: string;
  type: 'INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

type NotIncludesOptionCondition = {
  activityItemName: string;
  type: 'NOT_INCLUDES_OPTION';
  payload: {
    optionValue: string;
  };
};

type EqualToOptionCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
  };
};

type NotEqualToOptionCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_OPTION';
  payload: {
    optionValue: string;
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

type GreaterThanDateCondition = {
  activityItemName: string;
  type: 'GREATER_THAN_DATE';
  payload: {
    date: string;
  };
};

type LessThanDateCondition = {
  activityItemName: string;
  type: 'LESS_THAN_DATE';
  payload: {
    date: string;
  };
};

type EqualToDateCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_DATE';
  payload: {
    date: string;
  };
};

type NotEqualToDateCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_DATE';
  payload: {
    date: string;
  };
};

type BetweenDatesCondition = {
  activityItemName: string;
  type: 'BETWEEN_DATES';
  payload: {
    minDate: string;
    maxDate: string;
  };
};

type OutsideOfDatesCondition = {
  activityItemName: string;
  type: 'OUTSIDE_OF_DATES';
  payload: {
    minDate: string;
    maxDate: string;
  };
};

type GreaterThanTimeCondition = {
  activityItemName: string;
  type: 'GREATER_THAN_TIME';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type LessThanTimeCondition = {
  activityItemName: string;
  type: 'LESS_THAN_TIME';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type EqualToTimeCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_TIME';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type NotEqualToTimeCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_TIME';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type BetweenTimesCondition = {
  activityItemName: string;
  type: 'BETWEEN_TIMES';
  payload: {
    minTime: {
      hours: number;
      minutes: number;
    };
    maxTime: {
      hours: number;
      minutes: number;
    };
  };
};

type OutsideOfTimesCondition = {
  activityItemName: string;
  type: 'OUTSIDE_OF_TIMES';
  payload: {
    minTime: {
      hours: number;
      minutes: number;
    };
    maxTime: {
      hours: number;
      minutes: number;
    };
  };
};

type GreaterThanTimeRangeCondition = {
  activityItemName: string;
  type: 'GREATER_THAN_TIME_RANGE';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type LessThanTimeRangeCondition = {
  activityItemName: string;
  type: 'LESS_THAN_TIME_RANGE';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type EqualToTimeRangeCondition = {
  activityItemName: string;
  type: 'EQUAL_TO_TIME_RANGE';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type NotEqualToTimeRangeCondition = {
  activityItemName: string;
  type: 'NOT_EQUAL_TO_TIME_RANGE';
  payload: {
    time: {
      hours: number;
      minutes: number;
    };
  };
};

type BetweenTimesRangeCondition = {
  activityItemName: string;
  type: 'BETWEEN_TIMES_RANGE';
  payload: {
    minTime: {
      hours: number;
      minutes: number;
    };
    maxTime: {
      hours: number;
      minutes: number;
    };
  };
};

type OutsideOfTimesRangeCondition = {
  activityItemName: string;
  type: 'OUTSIDE_OF_TIMES_RANGE';
  payload: {
    minTime: {
      hours: number;
      minutes: number;
    };
    maxTime: {
      hours: number;
      minutes: number;
    };
  };
};
