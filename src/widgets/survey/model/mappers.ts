import {
  Answers,
  PipelineItem,
  PipelineItemAnswer,
  StackedRadioResponse,
} from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';
import {
  DayMonthYear,
  HourMinute,
  convertToDayMonthYear,
} from '@app/shared/lib';
import { Item } from '@app/shared/ui/survey/CheckBox/types';

type Answer = PipelineItemAnswer['value'];

type TimeRange = {
  endTime: HourMinute;
  startTime: HourMinute;
};

type StackedRadioAnswerValue = Array<Array<Item>>; // @Todo

export function mapAnswersToDto(
  pipeline: PipelineItem[],
  answers: Answers,
): Array<AnswerDto> {
  const filteredAnswers = Object.entries(answers).filter(([_, answer]) => {
    return answer.answer != null;
  });

  const result = filteredAnswers.map(([step, answer]) => {
    const pipelineItem = pipeline[+step];
    switch (pipelineItem.type) {
      case 'TextInput':
        return convertToTextAnswer(answer);

      case 'Radio':
        return convertToSingleSelectAnswer(answer);

      case 'Checkbox':
        return convertToCheckboxAnswer(answer);

      case 'Slider':
        return convertToSliderAnswer(answer);

      case 'Date':
        return convertToDateAnswerAnswer(answer);

      case 'NumberSelect':
        return convertToNumberSelectAnswer(answer);

      case 'TimeRange':
        return convertToTimeRangeAnswer(answer);

      case 'Geolocation':
        return convertToGeolocationAnswer(answer);

      case 'StackedRadio':
        return convertToStackedRadioAnswer(answer);

      case 'StackedCheckbox':
        return convertToTackedCheckboxAnswer(answer);

      default:
        return null;
    }
  });

  return result;
}

function convertToTextAnswer(answer: Answer) {
  return {
    value: answer.answer,
  };
}

function convertToSingleSelectAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToSliderAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToCheckboxAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToNumberSelectAnswer(answer: Answer) {
  return {
    value: answer.answer,
    text: answer.additionalAnswer ?? null,
  };
}

function convertToDateAnswerAnswer(answer: Answer) {
  const date = new Date(answer.answer as string);

  return {
    value: convertToDayMonthYear(date) as DayMonthYear,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeRangeAnswer(answer: Answer) {
  const timeRangeItem = answer.answer as TimeRange;
  const { startTime, endTime } = timeRangeItem;
  const answerDto = {
    from: {
      hour: startTime.hours,
      minute: startTime.minutes,
    },
    to: {
      hour: endTime.hours,
      minute: endTime.minutes,
    },
  };

  return {
    value: answerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToGeolocationAnswer(answer: Answer) {
  return {
    value: answer.answer,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedRadioAnswer(answer: Answer) {
  const answers = answer.answer as StackedRadioResponse;
  const answerDto = answers.map(
    answerItem => (answerItem ? answerItem.id : null), // @todo check with BE
  ) as string[];

  return {
    value: answerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTackedCheckboxAnswer(answer: Answer) {
  const answers = answer.answer as StackedRadioAnswerValue;

  const answersDto = answers.map(answerRow => {
    if (answerRow) {
      return answerRow.map(answerItem => (answerItem ? answerItem.id : null));
    }

    return null;
  });

  return {
    value: answersDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}
