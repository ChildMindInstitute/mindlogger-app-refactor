import { TestNode, TutorialRecord } from '@app/abstract/lib/types/abTrails';
import {
  BlockConfiguration,
  ButtonConfiguration,
  FlankerItemSettings,
  StimulusConfiguration,
} from '@app/abstract/lib/types/flanker';
import {
  ABTrailsItemDto,
  AdditionalResponseConfiguration,
  AudioItemDto,
  AudioPlayerItemDto,
  ConditionalLogicDto,
  DataMatrixDto,
  DateItemDto,
  DrawingItemDto,
  FlankerItemDto,
  GeolocationItemDto,
  MessageItemDto,
  MultiSelectionItemDto,
  MultiSelectionRowsItemDto,
  NumberSelectionItemDto,
  OptionsDto,
  ParagraphTextItemDto,
  PhotoItemDto,
  SingleSelectionItemDto,
  SingleSelectionRowsItemDto,
  SliderAlertsDto,
  SliderRowsDto,
  SliderRowsItemDto,
  SliderSelectionItemDto,
  StabilityTrackerItemDto,
  TextItemDto,
  TimeItemDto,
  TimeRangeItemDto,
  VideoItemDto,
} from '@app/shared/api/services/ActivityItemDto';
import { ActivityDto } from '@app/shared/api/services/IActivityService';
import { getMsFromSeconds } from '@app/shared/lib/utils/dateTime';

import { ActivityDetails, ActivityItem } from '../lib/types/activity';

function mapTimerValue(dtoTimer: number | null) {
  if (dtoTimer) {
    return getMsFromSeconds(dtoTimer);
  }
  return null;
}

function mapAdditionalText(configuration: AdditionalResponseConfiguration) {
  return configuration.additionalResponseOption.textInputOption
    ? {
        additionalText: {
          required: configuration.additionalResponseOption.textInputRequired,
        },
      }
    : null;
}

function mapConditionalLogic(dto: ConditionalLogicDto | null) {
  return dto
    ? {
        conditionalLogic: {
          match: dto.match,
          conditions: dto.conditions.map(condition => {
            const updatedCondition = {
              ...condition,
              activityItemName: condition.itemName,
            };

            switch (condition.type) {
              case 'INCLUDES_OPTION':
              case 'NOT_INCLUDES_OPTION':
              case 'EQUAL_TO_OPTION':
              case 'NOT_EQUAL_TO_OPTION':
                updatedCondition.payload = { optionValue: condition.payload.optionValue };
                break;

              case 'GREATER_THAN_DATE':
              case 'LESS_THAN_DATE':
              case 'EQUAL_TO_DATE':
              case 'NOT_EQUAL_TO_DATE':
                updatedCondition.payload = { date: condition.payload.date };
                break;

              case 'BETWEEN_DATES':
              case 'OUTSIDE_OF_DATES':
                updatedCondition.payload = {
                  minDate: condition.payload.minDate,
                  maxDate: condition.payload.maxDate,
                };
                break;

              case 'GREATER_THAN_TIME':
              case 'LESS_THAN_TIME':
              case 'EQUAL_TO_TIME':
              case 'NOT_EQUAL_TO_TIME':
                updatedCondition.payload = { time: condition.payload.time };
                break;

              case 'BETWEEN_TIMES':
              case 'OUTSIDE_OF_TIMES':
                updatedCondition.payload = {
                  minTime: condition.payload.minTime,
                  maxTime: condition.payload.maxTime,
                };
                break;

              case 'GREATER_THAN_TIME_RANGE':
              case 'LESS_THAN_TIME_RANGE':
              case 'EQUAL_TO_TIME_RANGE':
              case 'NOT_EQUAL_TO_TIME_RANGE':
                updatedCondition.payload = { time: condition.payload.time };
                break;

              case 'BETWEEN_TIMES_RANGE':
              case 'OUTSIDE_OF_TIMES_RANGE':
                updatedCondition.payload = {
                  minTime: condition.payload.minTime,
                  maxTime: condition.payload.maxTime,
                };
                break;

              default:
                updatedCondition.payload = condition.payload;
            }

            return updatedCondition;
          }),
        },
      }
    : null;
}

function mapToDrawing(dto: DrawingItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'DrawingTest',
    config: {
      imageUrl: dto.responseValues.drawingExample,
      backgroundImageUrl: dto.responseValues.drawingBackground,
      proportionEnabled: !!dto.responseValues.proportion?.enabled,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: !dto.config.removeUndoButton,
    hasTopNavigation: dto.config.navigationToTop,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
  };
}

function mapToAbTest(dto: ABTrailsItemDto): ActivityItem {
  const config = dto.config;

  const nodesSettingsDto = config.nodes;

  const nodes = nodesSettingsDto.nodes;

  const tutorials = config.tutorials;

  return {
    id: dto.id,
    name: dto.name,
    inputType: 'AbTrails',
    config: {
      config: {
        fontSize: nodesSettingsDto.fontSize,
        radius: nodesSettingsDto.radius,
        beginWordLength: nodesSettingsDto.beginWordLength,
        endWordLength: nodesSettingsDto.endWordLength,
        fontSizeBeginEnd: nodesSettingsDto.fontSizeBeginEnd,
      },
      deviceType: config.deviceType,
            nodes: nodes.map<TestNode>(x => ({
        ...x,
      })),
      tutorials: tutorials.tutorials.map<TutorialRecord>(x => ({
        ...x,
      })),
    },
    timer: null,
    order: dto.order,
    question: dto.question,
    isSkippable: false,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: false,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
  };
}

function mapToStabilityTracker(dto: StabilityTrackerItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'StabilityTracker',
    config: {
      lambdaSlope: dto.config.lambdaSlope,
      durationMinutes: dto.config.durationMinutes,
      trialsNumber: dto.config.trialsNumber,
      userInputType: dto.config.userInputType,
      phase: dto.config.phase,
    },
    timer: null,
    order: dto.order,
    question: dto.question,
    isSkippable: false,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: true,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
  };
}

function mapToFlanker(itemDto: FlankerItemDto): ActivityItem {
  const dto = itemDto.config;

  const settings: FlankerItemSettings = {
    blocks: dto.blocks.map<BlockConfiguration>(x => ({ ...x })),
    buttons: dto.buttons.map<ButtonConfiguration>(x => ({ ...x })),
    stimulusTrials: dto.stimulusTrials.map<StimulusConfiguration>(x => ({
      ...x,
    })),
    blockType: dto.blockType,
    fixationDuration: dto.fixationDuration ?? 0,
    fixationScreen: dto.fixationScreen ?? {
      image: '',
      value: '',
    },
    isFirstPractice: dto.isFirstPractice,
    isLastPractice: dto.isLastPractice,
    isLastTest: dto.isLastTest,
    nextButton: dto.nextButton,
    sampleSize: dto.sampleSize,
    samplingMethod: dto.samplingMethod,
    showFeedback: dto.showFeedback,
    showFixation: dto.showFixation,
    showResults: dto.showResults,
    trialDuration: dto.trialDuration,
    minimumAccuracy: dto.minimumAccuracy,
  };

  return {
    canBeReset: false,
    hasAlert: false,
    hasScore: false,
    hasTextResponse: false,
    hasTopNavigation: false,
    id: itemDto.id,
    inputType: 'Flanker',
    isHidden: false,
    isAbleToMoveBack: false,
    order: itemDto.order,
    isSkippable: false,
    name: itemDto.name,
    timer: null,
    question: itemDto.question,
    config: settings,
  };
}

function mapToAudio(dto: AudioItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Audio',
    config: {
      maxDuration: dto.responseValues.maxDuration,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToAudioPlayer(dto: AudioPlayerItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'AudioPlayer',
    config: {
      file: dto.responseValues.file,
      playOnce: dto.config.playOnce,
    },
    timer: null,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToDate(dto: DateItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Date',
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    config: null,
    question: dto.question,
    isHidden: dto.isHidden,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToTime(dto: TimeItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Time',
    config: null,
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToGeolocation(dto: GeolocationItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Geolocation',
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    config: null,
    question: dto.question,
    isHidden: dto.isHidden,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToMessage(dto: MessageItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Message',
    config: null,
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: false,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToCheckbox(dto: MultiSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Checkbox',
    config: {
      randomizeOptions: dto.config.randomizeOptions,
      setAlerts: dto.config.setAlerts,
      addTooltip: dto.config.addTooltip,
      setPalette: dto.config.setPalette,
      isGridView: dto.config.portraitLayout,
      options: mapToCheckboxOptions(dto.responseValues.options),
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToStackedCheckboxes(dto: MultiSelectionRowsItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'StackedCheckbox',
    config: {
      randomizeOptions: dto.config.randomizeOptions,
      setAlerts: dto.config.setAlerts,
      addTooltip: dto.config.addTooltip,
      addScores: dto.config.addScores,
      rows: dto.responseValues.rows,
      options: dto.responseValues.options,
      dataMatrix: mapToStackedCheckboxAlerts(dto.responseValues.dataMatrix),
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToNumberSelect(dto: NumberSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'NumberSelect',
    config: {
      min: dto.responseValues.minValue,
      max: dto.responseValues.maxValue,
    },
    order: dto.order,
    timer: null,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasAlert: false,
    hasScore: false,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToPhoto(dto: PhotoItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Photo',
    config: null,
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToRadio(dto: SingleSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Radio',
    config: {
      randomizeOptions: dto.config.randomizeOptions,
      setAlerts: dto.config.setAlerts,
      addTooltip: dto.config.addTooltip,
      autoAdvance: dto.config.autoAdvance,
      setPalette: dto.config.setPalette,
      options: mapToRadioAlerts(dto.responseValues.options),
      isGridView: dto.config.portraitLayout,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToStackedRadio(dto: SingleSelectionRowsItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'StackedRadio',
    config: {
      randomizeOptions: dto.config.randomizeOptions,
      setAlerts: dto.config.setAlerts,
      addTooltip: dto.config.addTooltip,
      addScores: dto.config.addScores,
      rows: dto.responseValues.rows,
      options: dto.responseValues.options,
      dataMatrix: mapToStackedRadioDataMatrix(dto.responseValues.dataMatrix),
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToSlider(dto: SliderSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Slider',
    config: {
      leftTitle: dto.responseValues.minLabel,
      rightTitle: dto.responseValues.maxLabel,
      leftImageUrl: dto.responseValues.minImage,
      rightImageUrl: dto.responseValues.maxImage,
      minValue: dto.responseValues.minValue,
      maxValue: dto.responseValues.maxValue,
      showTickMarks: dto.config.showTickMarks,
      showTickLabels: dto.config.showTickLabels,
      isContinuousSlider: dto.config.continuousSlider,
      alerts: mapToSliderAlerts(dto.responseValues.alerts),
      scores: dto.responseValues.scores,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToStackedSlider(dto: SliderRowsItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'StackedSlider',
    config: {
      setAlerts: dto.config.setAlerts,
      addScores: dto.config.addScores,
      rows: mapToStackedSliderAlerts(dto.responseValues.rows),
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToTextInput(dto: TextItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'TextInput',
    config: {
      maxLength: dto.config.maxResponseLength,
      isNumeric: dto.config.numericalResponseRequired,
      shouldIdentifyResponse: dto.config.responseDataIdentifier,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...(dto.config.correctAnswerRequired && {
      validationOptions: {
        correctAnswer: dto.config.correctAnswer,
      },
    }),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}
function mapToParagraphText(dto: ParagraphTextItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'ParagraphText',
    config: {
      maxLength: dto.config.maxResponseLength,
    },
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToTimeRange(dto: TimeRangeItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'TimeRange',
    config: null,
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToVideo(dto: VideoItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'Video',
    config: null,
    timer: mapTimerValue(dto.config.timer),
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
    ...mapConditionalLogic(dto.conditionalLogic),
  };
}

function mapToSplash(splashScreen: string): ActivityItem {
  return {
    id: 'Splash',
    inputType: 'Splash',
    config: {
      imageUrl: splashScreen,
    },
    order: 0,
    question: '',
    timer: null,
    isSkippable: true,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveBack: true,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: false,
  };
}

export function mapToActivity(dto: ActivityDto): ActivityDetails {
  const activity: ActivityDetails = {
    ...dto,
    id: dto.id,
    name: dto.name,
    description: dto.description,
    splashScreen: dto.splashScreen,
    image: dto.image,
    isHidden: dto.isHidden,
    showAllAtOnce: dto.showAllAtOnce,
    isSkippable: dto.isSkippable,
    isReviewable: dto.isReviewable,
    responseIsEditable: dto.responseIsEditable,
    order: dto.order,
    items: dto.items.map(item => {
      switch (item.responseType) {
        case 'ABTrails':
          return mapToAbTest(item);
        case 'stabilityTracker':
          return mapToStabilityTracker(item);
        case 'audio':
          return mapToAudio(item);
        case 'audioPlayer':
          return mapToAudioPlayer(item);
        case 'date':
          return mapToDate(item);
        case 'flanker':
          return mapToFlanker(item);
        case 'geolocation':
          return mapToGeolocation(item);
        case 'message':
          return mapToMessage(item);
        case 'multiSelect':
          return mapToCheckbox(item);
        case 'multiSelectRows':
          return mapToStackedCheckboxes(item);
        case 'numberSelect':
          return mapToNumberSelect(item);
        case 'photo':
          return mapToPhoto(item);
        case 'singleSelect':
          return mapToRadio(item);
        case 'singleSelectRows':
          return mapToStackedRadio(item);
        case 'slider':
          return mapToSlider(item);
        case 'sliderRows':
          return mapToStackedSlider(item);
        case 'text':
          return mapToTextInput(item);
        case 'paragraphText':
          return mapToParagraphText(item);
        case 'timeRange':
          return mapToTimeRange(item);
        case 'video':
          return mapToVideo(item);
        case 'drawing':
          return mapToDrawing(item);
        case 'time':
          return mapToTime(item);
      }
    }),
    hasSummary: dto.scoresAndReports?.showScoreSummary ?? false,
    scoreSettings:
      dto.scoresAndReports == null
        ? []
        : dto.scoresAndReports.reports
            .filter(x => x.type === 'score')
            .map(x => ({
              id: x.id,
              name: x.name,
              type: x.type,
              calculationType: x.calculationType,
              conditionalLogic: x.conditionalLogic,
              includedItems: x.itemsScore,
              scoringType: x.scoringType,
              subscaleName: x.subscaleName,
            })),
  };

  if (dto.splashScreen) {
    activity.items = [mapToSplash(dto.splashScreen), ...activity.items];
  }

  return activity;
}

function mapToRadioAlerts(options: OptionsDto) {
  return options.map(option => ({
    id: option.id,
    text: option.text,
    image: option.image,
    score: option.score,
    tooltip: option.tooltip,
    color: option.color,
    isHidden: option.isHidden,
    value: option.value,
    alert: option.alert
      ? {
          message: option.alert,
        }
      : null,
  }));
}

function mapToStackedRadioDataMatrix(dataMatrix: DataMatrixDto) {
  return (
    dataMatrix?.map(matrix => ({
      rowId: matrix.rowId,
      options: matrix.options.map(option => ({
        optionId: option.optionId,
        score: option.score,
        alert: option.alert
          ? {
              message: option.alert,
            }
          : null,
      })),
    })) ?? []
  );
}

function mapToSliderAlerts(alerts: SliderAlertsDto) {
  return (
    alerts?.map(alert => ({
      value: alert.value,
      minValue: alert.minValue,
      maxValue: alert.maxValue,
      message: alert.alert,
    })) ?? null
  );
}

function mapToCheckboxOptions(options: OptionsDto) {
  return options.map(option => ({
    id: option.id,
    text: option.text,
    image: option.image,
    score: option.score,
    tooltip: option.tooltip,
    color: option.color,
    isHidden: option.isHidden,
    value: option.value,
    alert: option.alert
      ? {
          message: option.alert,
        }
      : null,
    isNoneOption: !!option.isNoneAbove,
  }));
}

function mapToStackedCheckboxAlerts(dataMatrix: DataMatrixDto) {
  return (
    dataMatrix?.map(matrix => ({
      rowId: matrix.rowId,
      options: matrix.options.map(option => ({
        optionId: option.optionId,
        score: option.score,
        alert: option.alert
          ? {
              message: option.alert,
            }
          : null,
      })),
    })) ?? []
  );
}

function mapToStackedSliderAlerts(rows: SliderRowsDto) {
  return rows.map(row => ({
    leftTitle: row.minLabel,
    rightTitle: row.maxLabel,
    leftImageUrl: row.minImage,
    rightImageUrl: row.maxImage,
    minValue: row.minValue,
    maxValue: row.maxValue,
    id: row.id,
    label: row.label,
    alerts:
      row.alerts?.map(alert => ({
        value: alert.value,
        message: alert.alert,
      })) ?? null,
  }));
}
