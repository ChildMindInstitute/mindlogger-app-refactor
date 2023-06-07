import {
  Answers,
  PipelineItem,
  PipelineItemAnswer,
  StackedRadioResponse,
} from '@app/features/pass-survey';
import {
  AnswerDto,
  AudioAnswerDto,
  AudioPlayerAnswerDto,
  CheckboxAnswerDto,
  DateAnswerDto,
  GeolocationAnswerDto,
  NumberSelectAnswerDto,
  PhotoAnswerDto,
  RadioAnswerDto,
  SliderAnswerDto,
  StackedCheckboxAnswerDto,
  StackedRadioAnswerDto,
  StackedSliderAnswerDto,
  TextAnswerDto,
  TimeAnswerDto,
  TimeRangeAnswerDto,
  VideoAnswerDto,
} from '@app/shared/api';
import { HourMinute, convertToDayMonthYear } from '@app/shared/lib';
import { Item } from '@app/shared/ui';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem';

type Answer = PipelineItemAnswer['value'];

type TimeRange = {
  endTime: HourMinute;
  startTime: HourMinute;
};

type StackedRadioAnswerValue = Array<Array<Item>>;

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

      case 'Time':
        return convertToTimeAnswer(answer);

      case 'TimeRange':
        return convertToTimeRangeAnswer(answer);

      case 'Geolocation':
        return convertToGeolocationAnswer(answer);

      case 'StackedRadio':
        return convertToStackedRadioAnswer(answer);

      case 'StackedCheckbox':
        return convertToStackedCheckboxAnswer(answer);

      case 'StackedSlider':
        return convertToStackedSliderAnswer(answer);

      case 'Video':
        return convertToVideoAnswer(answer);

      case 'Photo':
        return convertToPhotoAnswer(answer);

      case 'Audio':
        return convertToAudioAnswer(answer);

      case 'AudioPlayer':
        return convertToAudioPlayerAnswer(answer);

      default:
        return null;
    }
  });

  return result;
}

function convertToTextAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as TextAnswerDto,
  };
}

function convertToSingleSelectAnswer(answer: Answer): AnswerDto {
  const radioValue = answer.answer as RadioOption;

  return {
    value: radioValue.value as RadioAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToSliderAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as SliderAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToCheckboxAnswer(answer: Answer): AnswerDto {
  const checkboxAnswers = answer.answer as Item[];
  const answerDto = checkboxAnswers.map(checkboxAnswer => checkboxAnswer.value);

  return {
    value: answerDto as CheckboxAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToNumberSelectAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as NumberSelectAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as TimeAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToDateAnswerAnswer(answer: Answer): AnswerDto {
  const date = new Date(answer.answer as string);

  return {
    value: convertToDayMonthYear(date) as DateAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeRangeAnswer(answer: Answer): AnswerDto {
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
    value: answerDto as TimeRangeAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToGeolocationAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as GeolocationAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedRadioAnswer(answer: Answer): AnswerDto {
  const answers = answer.answer as StackedRadioResponse;
  const answerDto = answers.map(answerItem =>
    answerItem ? answerItem.text : null,
  ) as string[];

  return {
    value: answerDto as StackedRadioAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedCheckboxAnswer(answer: Answer): AnswerDto {
  const answers = answer.answer as StackedRadioAnswerValue;

  const answersDto = answers.map(answerRow => {
    if (answerRow) {
      return answerRow.map(answerItem => (answerItem ? answerItem.text : null));
    }

    return null;
  });

  return {
    value: answersDto as StackedCheckboxAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedSliderAnswer(answer: Answer): AnswerDto {
  const answers = answer.answer as number[];
  const answerDto = answers.map(
    answerItem => answerItem || null, // @todo check with BE
  ) as number[];

  return {
    value: answerDto as StackedSliderAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToVideoAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as VideoAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToPhotoAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as PhotoAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToAudioAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as AudioAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToAudioPlayerAnswer(answer: Answer): AnswerDto {
  return {
    value: answer.answer as AudioPlayerAnswerDto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}
