import {
  Answers,
  PipelineItem,
  PipelineItemAnswer,
} from '@app/features/pass-survey';
import { AnswerDto } from '@app/shared/api';
import {
  DayMonthYear,
  HourMinute,
  convertToDayMonthYear,
} from '@app/shared/lib';

type Answer = PipelineItemAnswer['value'];

type TimeRange = {
  endTime: HourMinute;
  startTime: HourMinute;
};

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
        return convertToDateAnswer(answer);

      case 'NumberSelect':
        return convertToNumberSelectAnswer(answer);

      case 'TimeRange':
        return convertToTimeRange(answer);

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

function convertToDateAnswer(answer: Answer) {
  const date = new Date(answer.answer as string);

  return {
    value: convertToDayMonthYear(date) as DayMonthYear,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeRange(answer: Answer) {
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
