import {
  AbTestResponse,
  ActivityItemType,
  Answers,
  DrawingTestResponse,
  FlankerResponse,
  PipelineItem,
  PipelineItemAnswer,
  StackedRadioResponse,
  UserAction,
  StabilityTrackerResponse,
  RadioPipelineItem,
  RadioResponse,
  CheckboxPipelineItem,
  CheckboxResponse,
  StackedRadioPipelineItem,
  StackedCheckboxPipelineItem,
  StackedCheckboxResponse,
  SliderPipelineItem,
  SliderResponse,
  StackedSliderPipelineItem,
  StackedSliderResponse,
} from '@app/features/pass-survey';
import {
  AnswerDto,
  AudioAnswerDto,
  AudioPlayerAnswerDto,
  CheckboxAnswerDto,
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
  VideoAnswerDto,
  UserActionDto,
  FlankerAnswerRecordDto,
  ObjectAnswerDto,
  DrawerAnswerDto,
  DrawerLineDto,
  StabilityTrackerAnswerDto,
  AbTestAnswerDto,
  AbLogLineDto,
  AbLogPointDto,
  AnswerAlertsDto,
} from '@app/shared/api';
import { HourMinute, convertToDayMonthYear } from '@app/shared/lib';
import { Item } from '@app/shared/ui';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem';

import { canItemHaveAnswer } from './operations';

type Answer = PipelineItemAnswer['value'];

type TimeRange = {
  endTime: HourMinute;
  startTime: HourMinute;
};

type StackedRadioAnswerValue = Array<Array<Item>>;

export function mapAnswersToDto(
  pipeline: PipelineItem[],
  answers: Answers,
): AnswerDto[] {
  if (pipeline.some(x => x.type === 'Flanker')) {
    return mapFlankerAnswersToDto(pipeline, answers);
  }

  const answerDtos: Array<AnswerDto> = [];

  pipeline.forEach((pipelineItem, step) => {
    const canHaveAnswer = canItemHaveAnswer(pipelineItem);

    if (canHaveAnswer) {
      const answer = answers[step] ?? null;

      const dto =
        answer === null || answer?.answer === null
          ? null
          : convertToAnswerDto(pipelineItem.type, answer);

      answerDtos.push(dto);
    }
  });

  return answerDtos;
}

const mapFlankerAnswersToDto = (
  pipeline: PipelineItem[],
  answers: Answers,
): AnswerDto[] => {
  const practiceSteps = pipeline
    .map((x, index) =>
      x.type === 'Flanker' && x.payload.blockType === 'practice' ? index : null,
    )
    .filter(x => x !== null)
    .map(x => x!);

  const firstPracticeAnswer = answers[practiceSteps[0]];

  const firstAnswerDto: AnswerDto = convertToAnswerDto(
    'Flanker',
    firstPracticeAnswer,
  );

  const restOfAnswerDtos = practiceSteps
    .filter(x => x !== practiceSteps[0])
    .filter(x => !!answers[x])
    .map(x => convertToAnswerDto('Flanker', answers[x]));

  for (let practiceAnswerDto of restOfAnswerDtos) {
    const records = (practiceAnswerDto as ObjectAnswerDto)
      .value as Array<FlankerAnswerRecordDto>;

    const firstItemRecords = (firstAnswerDto as ObjectAnswerDto)
      .value as Array<FlankerAnswerRecordDto>;

    firstItemRecords.push(...records);
  }

  return pipeline.map<AnswerDto | null>((pipelineItem, step) => {
    if (step === practiceSteps[0]) {
      return firstAnswerDto;
    } else if (practiceSteps.includes(step)) {
      return null;
    }

    const answer = answers[step] ?? null;
    return answer === null
      ? null
      : convertToAnswerDto(pipelineItem.type, answer);
  });
};

function convertToTextAnswer(answer: Answer): AnswerDto {
  return answer.answer as TextAnswerDto;
}

function convertToSingleSelectAnswer(answer: Answer): AnswerDto {
  const radioValue = answer.answer as RadioOption;

  return {
    ...(radioValue && {
      value: radioValue.value as RadioAnswerDto,
    }),
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
  const answerDto = checkboxAnswers?.map(
    checkboxAnswer => checkboxAnswer.value,
  );

  return {
    ...(answerDto && {
      value: answerDto as CheckboxAnswerDto,
    }),
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
  return {
    ...(answer.answer && {
      value: convertToDayMonthYear(new Date(answer.answer as string)),
    }),
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeRangeAnswer(answer: Answer): AnswerDto {
  const timeRangeItem = answer.answer as TimeRange;
  const { startTime, endTime } = timeRangeItem ?? {};

  return {
    ...(timeRangeItem && {
      value: {
        from: {
          hour: startTime.hours,
          minute: startTime.minutes,
        },
        to: {
          hour: endTime.hours,
          minute: endTime.minutes,
        },
      },
    }),
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
  const answerDto = answers?.map(answerItem =>
    answerItem ? answerItem.text : null,
  ) as string[];

  return {
    ...(answerDto && {
      value: answerDto as StackedRadioAnswerDto,
    }),
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedCheckboxAnswer(answer: Answer): AnswerDto {
  const answers = answer.answer as StackedRadioAnswerValue;

  const answersDto = answers?.map(answerRow => {
    if (answerRow) {
      return answerRow.map(answerItem => (answerItem ? answerItem.text : null));
    }

    return null;
  });

  return {
    ...(answersDto && {
      value: answersDto as StackedCheckboxAnswerDto,
    }),
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStackedSliderAnswer(answer: Answer): AnswerDto {
  const answers = answer.answer as number[];
  const answerDto = answers?.map(
    answerItem => answerItem || null, // @todo check with BE
  ) as number[];

  return {
    ...(answerDto && {
      value: answerDto as StackedSliderAnswerDto,
    }),
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

function convertToFlankerAnswer(answer: Answer): AnswerDto {
  const gameResponse = answer.answer as FlankerResponse;

  const recordDtos = gameResponse.records.map<FlankerAnswerRecordDto>(x => ({
    button_pressed: x.buttonPressed,
    correct: x.correct,
    duration: x.duration,
    offset: x.offset,
    question: x.question,
    response_touch_timestamp: x.responseTouchTimestamp,
    start_time: x.startTime,
    start_timestamp: x.startTimestamp,
    tag: x.tag,
    trial_index: x.trialIndex,
  }));

  return {
    value: recordDtos,
  };
}

function convertToDrawingAnswer(answer: Answer): AnswerDto {
  const drawerResponse = answer.answer as DrawingTestResponse;

  const dto: DrawerAnswerDto = {
    svgString: drawerResponse.svgString,
    width: drawerResponse.width,
    fileName: drawerResponse.fileName,
    type: drawerResponse.type,
    uri: drawerResponse.uri,
    lines: drawerResponse.lines.map<DrawerLineDto>(x => ({
      startTime: x.startTime,
      points: x.points,
    })),
  };

  return {
    value: dto,
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToStabilityTrackerAnswer(answer: Answer): AnswerDto {
  const stabilityTrackerResponse = answer.answer as StabilityTrackerResponse;

  const values = stabilityTrackerResponse.value.map(x => ({
    timestamp: x.timestamp,
    stimPos: x.circlePosition,
    targetPos: x.targetPosition,
    userPos: x.userPosition,
    score: x.score,
    lambda: x.lambda,
    lambdaSlope: x.lambdaSlope,
  }));

  const dto: StabilityTrackerAnswerDto = {
    value: values,
    maxLambda: stabilityTrackerResponse.maxLambda,
    phaseType:
      stabilityTrackerResponse.phaseType === 'test'
        ? 'focus-phase'
        : 'challenge-phase',
  };

  return {
    value: dto,
  };
}

function convertToAbTestAnswer(answer: Answer): AnswerDto {
  const abResponse = answer.answer as AbTestResponse;

  const dto: AbTestAnswerDto = {
    currentIndex: abResponse.currentIndex,
    startTime: abResponse.startTime,
    width: abResponse.width,
    updated: abResponse.updated,
    lines: abResponse.lines.map<AbLogLineDto>(x => ({
      points: x.points.map<AbLogPointDto>(p => ({
        ...p,
        actual: p.actual ?? undefined,
      })),
    })),
  };

  return {
    value: dto,
  };
}

function convertToAnswerDto(type: ActivityItemType, answer: Answer): AnswerDto {
  switch (type) {
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

    case 'Flanker':
      return convertToFlankerAnswer(answer);

    case 'DrawingTest':
      return convertToDrawingAnswer(answer);

    case 'StabilityTracker':
      return convertToStabilityTrackerAnswer(answer);

    case 'AbTest': {
      return convertToAbTestAnswer(answer);
    }

    default:
      return null;
  }
}

export function mapUserActionsToDto(actions: UserAction[]): UserActionDto[] {
  return actions.map(action => {
    return {
      type: action.type,
      screen: `${action.payload.activityId}/${action.payload.activityItemId}`,
      time: action.payload.date,
      ...(action.type === 'SET_ANSWER' && {
        response: convertToAnswerDto(
          action.payload.answer.type,
          action.payload.answer.value,
        ),
      }),
    };
  });
}

export function mapAnswersToAlerts(
  pipelineItems: PipelineItem[],
  answers: Answers,
) {
  const alerts = pipelineItems
    .flatMap((pipelineItem, step) => {
      const canHaveAnswer =
        pipelineItem.type !== 'Tutorial' && pipelineItem.type !== 'Splash';

      if (canHaveAnswer && answers[step]) {
        const answer = answers[step];

        return convertAnswersToAlerts(pipelineItem, answer);
      }
    })
    .filter(Boolean);

  return alerts as AnswerAlertsDto;
}

export function convertAnswersToAlerts(
  pipelineItem: PipelineItem,
  answer: Answer,
) {
  switch (pipelineItem.type) {
    case 'Radio':
      return convertRadioAlerts(pipelineItem, answer);

    case 'Checkbox':
      return convertCheckboxAlerts(pipelineItem, answer);

    case 'StackedRadio':
      return convertStackedRadioAlerts(pipelineItem, answer);

    case 'StackedCheckbox':
      return convertStackedCheckboxAlerts(pipelineItem, answer);

    case 'Slider':
      return convertSliderAlerts(pipelineItem, answer);

    case 'StackedSlider':
      return convertStackedSliderAlerts(pipelineItem, answer);
  }
}

function convertRadioAlerts(radioItem: RadioPipelineItem, answer: Answer) {
  const alerts: AnswerAlertsDto = [];

  const radioAnswer = answer.answer as RadioResponse;

  const alertOption = radioItem.payload.options.find(
    o => o.alert && o.value === radioAnswer.value,
  );

  if (alertOption) {
    alerts.push({
      activityItemId: radioItem.id!,
      message: alertOption!.alert!.message,
    });
  }

  return alerts;
}

function convertCheckboxAlerts(
  checkboxItem: CheckboxPipelineItem,
  answer: Answer,
) {
  const checkboxAnswers = answer.answer as CheckboxResponse;
  const alertOptions = checkboxItem.payload.options.filter(o => {
    const checkboxAnswerAlert = checkboxAnswers?.find(checkboxAnswer => {
      return checkboxAnswer.value === o.value;
    });

    return checkboxAnswerAlert && o.alert;
  });

  const alerts = alertOptions
    .filter(alertOption => !!alertOption.alert)
    .map(alertOption => {
      return {
        activityItemId: checkboxItem.id!,
        message: alertOption.alert!.message,
      };
    });

  return alerts;
}

function convertStackedRadioAlerts(
  stackedRadioItem: StackedRadioPipelineItem,
  answer: Answer,
) {
  const stackedRadioAnswer = answer.answer as StackedRadioResponse;

  const alerts: AnswerAlertsDto = [];

  stackedRadioItem.payload.dataMatrix.forEach(row => {
    row.options.forEach(option => {
      stackedRadioAnswer.forEach(itemAnswer => {
        if (
          itemAnswer?.rowId === row.rowId &&
          itemAnswer.id === option.optionId!
        ) {
          option.alert &&
            alerts.push({
              activityItemId: stackedRadioItem.id!,
              message: option.alert!.message,
            });
        }
      });
    });
  });

  return alerts;
}

function convertStackedCheckboxAlerts(
  stackedCheckboxItem: StackedCheckboxPipelineItem,
  answer: Answer,
) {
  const stackedCheckboxAnswer = answer.answer as StackedCheckboxResponse;

  if (!stackedCheckboxAnswer) {
    return [];
  }

  const alerts: AnswerAlertsDto = [];

  stackedCheckboxItem.payload.dataMatrix.forEach((row, rowIndex) => {
    if (stackedCheckboxAnswer[rowIndex]?.length) {
      row.options.forEach(option => {
        stackedCheckboxAnswer[rowIndex].forEach(itemAnswer => {
          if (
            stackedCheckboxAnswer[rowIndex] &&
            itemAnswer.id === option.optionId!
          ) {
            option.alert &&
              alerts.push({
                activityItemId: stackedCheckboxItem.id!,
                message: option.alert!.message,
              });
          }
        });
      });
    }
  });

  return alerts;
}

function convertSliderAlerts(sliderItem: SliderPipelineItem, answer: Answer) {
  const sliderAnswer = answer.answer as SliderResponse;

  if (!sliderItem.payload.alerts || !sliderAnswer) {
    return [];
  }

  const alerts: AnswerAlertsDto = [];

  sliderItem.payload.alerts.forEach(alert => {
    if (
      alert.value === sliderAnswer ||
      (sliderAnswer >= alert.minValue && sliderAnswer <= alert.maxValue)
    ) {
      alerts.push({
        activityItemId: sliderItem.id!,
        message: alert.message,
      });
    }
  });

  return alerts;
}

function convertStackedSliderAlerts(
  sliderItem: StackedSliderPipelineItem,
  answer: Answer,
) {
  const sliderAnswer = answer.answer as StackedSliderResponse;

  if (!sliderAnswer) {
    return [];
  }

  const alerts: AnswerAlertsDto = [];

  sliderItem.payload.rows.forEach((row, rowIndex) => {
    if (row.alerts) {
      row.alerts.forEach(alert => {
        if (alert.value === sliderAnswer[rowIndex]) {
          alerts.push({
            activityItemId: sliderItem.id!,
            message: alert.message,
          });
        }
      });
    }
  });

  return alerts;
}
