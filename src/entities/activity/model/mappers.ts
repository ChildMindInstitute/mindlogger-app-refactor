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
  SingleSelectionRowsItemDto,
  SliderSelectionItemDto,
  SliderRowsItemDto,
  TextItemDto,
  TimeRangeItemDto,
  VideoItemDto,
  AdditionalResponseConfiguration,
} from '@app/shared/api';
import { getMsFromSeconds } from '@app/shared/lib';

import { ActivityDetails, ActivityItem } from '../lib';

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

function mapToDrawing(dto: DrawingItemDto): ActivityItem {
  return {
    id: dto.id,
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

function mapToAudio(dto: AudioItemDto): ActivityItem {
  return {
    id: dto.id,
    inputType: 'Audio',
    config: {
      maxDuration: dto.responseValues.maxDuration,
    },
    timer: mapTimerValue(dto.timer),
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
    inputType: 'AudioPlayer',
    config: {
      file: dto.responseValues.file,
      playOnce: dto.config.playOnce,
    },
    timer: mapTimerValue(dto.timer),
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
    inputType: 'Date',
    timer: dto.config.timer,
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

function mapToFlanker(dto: FlankerItemDto): ActivityItem {
  return dto as any;
}

function mapToGeolocation(dto: GeolocationItemDto): ActivityItem {
  return {
    id: dto.id,
    inputType: 'Geolocation',
    timer: dto.config.timer,
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
    inputType: 'Message',
    config: null,
    timer: mapTimerValue(dto.timer),
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
  };
}

function mapToStackedCheckboxes(dto: MultiSelectionRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToNumberSelect(dto: NumberSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
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
  };
}

function mapToStackedRadio(dto: SingleSelectionRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToSlider(dto: SliderSelectionItemDto): ActivityItem {
  return {
    id: dto.id,
    inputType: 'Slider',
    config: {
      leftTitle: dto.responseValues.minLabel,
      rightTitle: dto.responseValues.maxLabel,
      leftImageUrl: dto.responseValues.minImage,
      rightImageUrl: dto.responseValues.maxImage,
      showTickMarks: dto.config.showTickMarks,
      showTickLabels: dto.config.showTickLabels,
      isContinuousSlider: dto.config.continuousSlider,
      minValue: dto.responseValues.minValue,
      maxValue: dto.responseValues.maxValue,
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
  };
}

function mapToStackedSlider(dto: SliderRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToTextInput(dto: TextItemDto): ActivityItem {
  return {
    id: dto.id,
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
  };
}

function mapToTimeRange(dto: TimeRangeItemDto): ActivityItem {
  return {
    id: dto.id,
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
      }
    }),
  };

  if (dto.splashScreen) {
    activity.items = [mapToSplash(dto.splashScreen), ...activity.items];
  }

  return activity;
}
