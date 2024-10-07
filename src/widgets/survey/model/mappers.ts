import { Answers } from '@app/features/pass-survey/lib/hooks/useActivityStorageRecord';
import {
  AbTestResponse,
  ActivityItemType,
  CheckboxPipelineItem,
  DrawingTestResponse,
  FlankerResponse,
  PipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
  StabilityTrackerResponse,
  StackedCheckboxPipelineItem,
  StackedRadioPipelineItem,
  StackedRadioResponse,
  StackedSliderPipelineItem,
} from '@app/features/pass-survey/lib/types/payload';
import { PipelineItemAnswer } from '@app/features/pass-survey/lib/types/pipelineItemAnswer';
import { AnswerAlerts } from '@app/features/pass-survey/lib/types/summary';
import { UserAction } from '@app/features/pass-survey/lib/types/userAction';
import { getDefaultAlertsExtractor } from '@app/features/pass-survey/model/alertsExtractorInstance';
import {
  AbLogLineDto,
  AbLogPointDto,
  AbTestAnswerDto,
  AnswerAlertsDto,
  AnswerDto,
  AudioAnswerDto,
  AudioPlayerAnswerDto,
  CheckboxAnswerDto,
  DrawerAnswerDto,
  DrawerLineDto,
  FlankerAnswerRecordDto,
  GeolocationAnswerDto,
  NumberSelectAnswerDto,
  ObjectAnswerDto,
  ParagraphTextAnswerDto,
  PhotoAnswerDto,
  SliderAnswerDto,
  StabilityTrackerAnswerDto,
  StackedCheckboxAnswerDto,
  StackedRadioAnswerDto,
  StackedSliderAnswerDto,
  TextAnswerDto,
  TimeAnswerDto,
  TimeRangeAnswerDto,
  UserActionDto,
  VideoAnswerDto,
} from '@app/shared/api/services/IAnswerService';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { HourMinute } from '@app/shared/lib/types/dateTime';
import {
  convertToDayMonthYear,
  getDateFromString,
} from '@app/shared/lib/utils/dateTime';
import { Item } from '@app/shared/ui/survey/CheckBox/types';
import { RadioOption } from '@app/shared/ui/survey/RadioActivityItem/types';

import { canItemHaveAnswer } from './operations';

type Answer = PipelineItemAnswer['value'];

type TimeRange = {
  endTime: HourMinute | null;
  startTime: HourMinute | null;
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
    const canHaveAnswer = canItemHaveAnswer(pipelineItem.type);

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

  for (const practiceAnswerDto of restOfAnswerDtos) {
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
function convertToParagraphTextAnswer(answer: Answer): AnswerDto {
  return answer.answer as ParagraphTextAnswerDto;
}
function convertToSingleSelectAnswer(answer: Answer): AnswerDto {
  const radioValue = answer.answer as RadioOption;

  return {
    ...(radioValue && {
      value: radioValue.value,
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
      value: convertToDayMonthYear(getDateFromString(answer.answer as string)),
    }),
    ...(answer.additionalAnswer && {
      text: answer.additionalAnswer,
    }),
  };
}

function convertToTimeRangeAnswer(answer: Answer): AnswerDto {
  const timeRangeItem = answer.answer as TimeRange;
  const { startTime, endTime } = timeRangeItem ?? {};

  const timeRangeValue = {
    value: {
      from: null,
      to: null,
    } as TimeRangeAnswerDto,
  };

  if (startTime) {
    timeRangeValue.value.from = {
      hour: startTime.hours,
      minute: startTime.minutes,
    };
  }
  if (endTime) {
    timeRangeValue.value.to = {
      hour: endTime?.hours,
      minute: endTime?.minutes,
    };
  }

  return {
    ...timeRangeValue,
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
  return {
    ...(answer.answer && {
      value: answer.answer as StackedSliderAnswerDto,
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

  return dto;
}

function convertToAbTestAnswer(answer: Answer): AnswerDto {
  const abResponse = answer.answer as AbTestResponse;

  const dto: AbTestAnswerDto = {
    currentIndex: abResponse.currentIndex,
    maximumIndex: abResponse.maximumIndex,
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

    case 'ParagraphText':
      return convertToParagraphTextAnswer(answer);

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
  try {
    const alerts = pipelineItems
      .flatMap((pipelineItem, step) => {
        const canHaveAnswer = canItemHaveAnswer(pipelineItem.type);

        if (canHaveAnswer && answers[step]) {
          const answer = answers[step];

          return convertAnswersToAlerts(pipelineItem, answer);
        }
      })
      .filter(Boolean);

    return alerts as AnswerAlertsDto;
  } catch (error) {
    getDefaultLogger().warn(
      `[mapAnswersToAlerts]: Error occurred: \n\n${error}`,
    );
    throw error;
  }
}

export function convertAnswersToAlerts(
  pipelineItem: PipelineItem,
  answer: Answer,
): AnswerAlertsDto {
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

    default:
      return [];
  }
}

function convertRadioAlerts(radioItem: RadioPipelineItem, answer: Answer) {
  const alerts: AnswerAlerts = getDefaultAlertsExtractor().extractFromRadio(
    radioItem,
    answer,
  );

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}

function convertCheckboxAlerts(
  checkboxItem: CheckboxPipelineItem,
  answer: Answer,
) {
  const alerts: AnswerAlerts = getDefaultAlertsExtractor().extractFromCheckbox(
    checkboxItem,
    answer,
  );

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}

function convertStackedRadioAlerts(
  stackedRadioItem: StackedRadioPipelineItem,
  answer: Answer,
) {
  const alerts: AnswerAlerts =
    getDefaultAlertsExtractor().extractFromStackedRadio(
      stackedRadioItem,
      answer,
    );

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}

function convertStackedCheckboxAlerts(
  stackedCheckboxItem: StackedCheckboxPipelineItem,
  answer: Answer,
) {
  const alerts: AnswerAlerts =
    getDefaultAlertsExtractor().extractFromStackedCheckbox(
      stackedCheckboxItem,
      answer,
    );

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}

function convertSliderAlerts(sliderItem: SliderPipelineItem, answer: Answer) {
  const alerts: AnswerAlerts = getDefaultAlertsExtractor().extractFromSlider(
    sliderItem,
    answer,
  );

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}

function convertStackedSliderAlerts(
  sliderItem: StackedSliderPipelineItem,
  answer: Answer,
) {
  const alerts: AnswerAlerts =
    getDefaultAlertsExtractor().extractFromStackedSlider(sliderItem, answer);

  const alertDtos: AnswerAlertsDto = alerts;

  return alertDtos;
}
