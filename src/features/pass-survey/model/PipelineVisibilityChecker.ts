import { AnswerValidator } from './AnswerValidator';
import { Answers } from '../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../lib/types/payload';

export function PipelineVisibilityChecker(
  pipeline: PipelineItem[],
  answers: Answers,
) {
  function parseTimeString(timeStr: string) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  }

  function isValidTimeFormat(time: any): boolean {
    return (
      time && typeof time.hours === 'number' && typeof time.minutes === 'number'
    );
  }
  function isItemVisible(index: number) {
    if (index >= pipeline.length) {
      return false;
    }

    const item = pipeline[index];

    if (!item.conditionalLogic) {
      return true;
    }

    const method = item.conditionalLogic.match === 'all' ? 'every' : 'some';

    return item.conditionalLogic.conditions[method](condition => {
      const step = pipeline.findIndex(
        x => x.name === condition.activityItemName,
      );

      const answerValidator = AnswerValidator({
        step,
        answers,
        items: pipeline,
      });

      switch (condition.type) {
        case 'BETWEEN':
          return answerValidator.isBetweenValues(
            condition.payload.minValue,
            condition.payload.maxValue,
          );

        case 'OUTSIDE_OF':
          return answerValidator.isOutsideOfValues(
            condition.payload.minValue,
            condition.payload.maxValue,
          );

        case 'EQUAL':
          return answerValidator.isEqualToValue(condition.payload.value);

        case 'NOT_EQUAL':
          return !answerValidator.isEqualToValue(condition.payload.value);

        case 'EQUAL_TO_OPTION':
          return answerValidator.isEqualToOption(condition.payload.optionValue);

        case 'NOT_EQUAL_TO_OPTION':
          return !answerValidator.isEqualToOption(
            condition.payload.optionValue,
          );

        case 'GREATER_THAN':
          return answerValidator.isGreaterThan(condition.payload.value);

        case 'LESS_THAN':
          return answerValidator.isLessThan(condition.payload.value);

        case 'INCLUDES_OPTION':
          return answerValidator.includesOption(condition.payload.optionValue);

        case 'NOT_INCLUDES_OPTION':
          return answerValidator.notIncludesOption(
            condition.payload.optionValue,
          );

        case 'GREATER_THAN_DATE':
          return answerValidator.isGreaterThanDate(condition.payload.date);

        case 'LESS_THAN_DATE':
          return answerValidator.isLessThanDate(condition.payload.date);

        case 'EQUAL_TO_DATE':
          return answerValidator.isEqualToDate(condition.payload.date);

        case 'NOT_EQUAL_TO_DATE':
          return answerValidator.isNotEqualToDate(condition.payload.date);

        case 'BETWEEN_DATES':
          return answerValidator.isBetweenDates(
            condition.payload.minDate,
            condition.payload.maxDate,
          );

        case 'OUTSIDE_OF_DATES':
          return answerValidator.isOutsideOfDates(
            condition.payload.minDate,
            condition.payload.maxDate,
          );

        case 'GREATER_THAN_TIME': {
          let conditionTime = condition.payload?.time;

          if (typeof conditionTime === 'string') {
            conditionTime = parseTimeString(conditionTime);
          }

          if (!isValidTimeFormat(conditionTime)) {
            return false;
          }

          const isGreater = answerValidator.isGreaterThanTime(conditionTime);

          return isGreater;
        }

        case 'LESS_THAN_TIME':
          return answerValidator.isLessThanTime(condition.payload.time);

        case 'EQUAL_TO_TIME':
          return answerValidator.isEqualToTime(condition.payload.time);

        case 'NOT_EQUAL_TO_TIME':
          return answerValidator.isNotEqualToTime(condition.payload.time);

        case 'BETWEEN_TIMES':
          return answerValidator.isBetweenTimes(
            condition.payload.minTime,
            condition.payload.maxTime,
          );

        case 'OUTSIDE_OF_TIMES':
          return answerValidator.isOutsideOfTimes(
            condition.payload.minTime,
            condition.payload.maxTime,
          );

        case 'GREATER_THAN_TIME_RANGE':
          return answerValidator.isGreaterThanTimeRange(
            condition.payload.time,
            condition.payload.fieldName,
          );

        case 'LESS_THAN_TIME_RANGE':
          return answerValidator.isLessThanTimeRange(
            condition.payload.time,
            condition.payload.fieldName,
          );

        case 'EQUAL_TO_TIME_RANGE':
          return answerValidator.isEqualToTimeRange(
            condition.payload.time,
            condition.payload.fieldName,
          );

        case 'NOT_EQUAL_TO_TIME_RANGE':
          return answerValidator.isNotEqualToTimeRange(
            condition.payload.time,
            condition.payload.fieldName,
          );

        case 'BETWEEN_TIMES_RANGE':
          return answerValidator.isBetweenTimesRange(
            condition.payload.minTime,
            condition.payload.maxTime,
            condition.payload.fieldName,
          );

        case 'OUTSIDE_OF_TIMES_RANGE':
          return answerValidator.isOutsideOfTimesRange(
            condition.payload.minTime,
            condition.payload.maxTime,
            condition.payload.fieldName,
          );

        case 'EQUAL_TO_SLIDER_ROWS':
          return answerValidator.isEqualToSliderRow(
            condition.payload.rowIndex,
            condition.payload.value,
          );

        case 'NOT_EQUAL_TO_SLIDER_ROWS':
          return answerValidator.isNotEqualToSliderRow(
            condition.payload.rowIndex,
            condition.payload.value,
          );

        case 'GREATER_THAN_SLIDER_ROWS':
          return answerValidator.isGreaterThanSliderRow(
            condition.payload.rowIndex,
            condition.payload.value,
          );

        case 'LESS_THAN_SLIDER_ROWS':
          return answerValidator.isLessThanSliderRow(
            condition.payload.rowIndex,
            condition.payload.value,
          );

        case 'BETWEEN_SLIDER_ROWS':
          return answerValidator.isBetweenSliderRowValues(
            condition.payload.rowIndex,
            condition.payload.minValue,
            condition.payload.maxValue,
          );

        case 'OUTSIDE_OF_SLIDER_ROWS':
          return answerValidator.isOutsideOfSliderRowValues(
            condition.payload.rowIndex,
            condition.payload.minValue,
            condition.payload.maxValue,
          );

        case 'EQUAL_TO_ROW_OPTION':
          return answerValidator.isEqualToRowOption(
            condition.payload.rowIndex,
            condition.payload.optionValue,
          );

        case 'NOT_EQUAL_TO_ROW_OPTION':
          return answerValidator.isNotEqualToRowOption(
            condition.payload.rowIndex,
            condition.payload.optionValue,
          );

        case 'INCLUDES_ROW_OPTION':
          return answerValidator.includesRowOption(
            condition.payload.rowIndex,
            condition.payload.optionValue,
          );

        case 'NOT_INCLUDES_ROW_OPTION':
          return answerValidator.notIncludesRowOption(
            condition.payload.rowIndex,
            condition.payload.optionValue,
          );

        default:
          return true;
      }
    });
  }

  return {
    isItemVisible,
  };
}
