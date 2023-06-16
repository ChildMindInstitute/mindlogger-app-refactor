import {
  ActivityDto,
  DrawingItemDto,
  AbTestItemDto,
  AudioItemDto,
  AudioPlayerItemDto,
  DateItemDto,
  FlankerItemDto,
  GeolocationItemDto,
  MessageItemDto,
  MultiSelectionItemDto,
  MultiSelectionRowsItemDto,
  NumberSelectionItemDto,
  PhotoItemDto,
  SingleSelectionItemDto,
  SliderSelectionItemDto,
  SliderRowsItemDto,
  TextItemDto,
  TimeRangeItemDto,
  VideoItemDto,
  AdditionalResponseConfiguration,
  TimeItemDto,
  SingleSelectionRowsItemDto,
  ConditionalLogicDto,
} from '@app/shared/api';
import { getMsFromSeconds } from '@app/shared/lib';

import { ActivityDetails, ActivityItem } from '../lib';
import { FlankerSettings } from '../lib/types/flanker';

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
            return {
              ...condition,
              activityItemName: condition.itemName,
            };
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

function mapToAbTest(dto: AbTestItemDto): ActivityItem {
  return {
    id: dto.id,
    name: dto.name,
    inputType: 'AbTest',
    config: {
      device: dto.responseValues.device,
    },
    timer: mapTimerValue(dto.config.timer),
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

function mapToFlanker(itemDto: FlankerItemDto): ActivityItem {
  const dto = itemDto.responseValues;

  const settings: FlankerSettings = {
    general: {
      buttons: [...dto.general.buttons],
      fixation: dto.general.fixation ? { ...dto.general.fixation } : null,
      instruction: dto.general.instruction,
      stimulusTrials: [...dto.general.stimulusTrials],
    },
    practice: {
      blocks: [...dto.practice.blocks],
      instruction: dto.practice.instruction,
      randomizeOrder: dto.practice.randomizeOrder,
      showFeedback: dto.practice.showFeedback,
      showSummary: dto.practice.showSummary,
      stimulusDuration: dto.practice.stimulusDuration,
      threshold: dto.practice.threshold,
    },
    test: {
      blocks: [...dto.test.blocks],
      instruction: dto.test.instruction,
      randomizeOrder: dto.test.randomizeOrder,
      showFeedback: dto.test.showFeedback,
      showSummary: dto.test.showSummary,
      stimulusDuration: dto.test.stimulusDuration,
    },
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
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
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
    canBeReset: false,
    hasTopNavigation: false,
    isHidden: dto.isHidden,
    ...mapAdditionalText(dto.config),
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
      options: dto.responseValues.options,
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
      dataMatrix: dto.responseValues.dataMatrix,
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
      setPalette: dto.config.setPalette,
      options: dto.responseValues.options,
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
      dataMatrix: dto.responseValues.dataMatrix,
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
      rows: dto.responseValues.rows.map(item => ({
        ...item,
        leftTitle: item.minLabel,
        rightTitle: item.maxLabel,
        leftImageUrl: item.minImage,
        rightImageUrl: item.maxImage,
      })),
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
  const activity = {
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
        case 'abTest':
          return mapToAbTest(item);
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
  };

  if (dto.splashScreen) {
    activity.items = [mapToSplash(dto.splashScreen), ...activity.items];
  }

  return activity;
}
