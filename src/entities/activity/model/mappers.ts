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

import { ActivityDetails, ActivityItem } from '../lib';

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
    timer: dto.config.timer,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: !dto.config.removeUndoButton,
    hasTopNavigation: dto.config.navigationToTop,
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
    timer: dto.config.timer,
    order: dto.order,
    question: dto.question,
    isSkippable: false,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: false,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
  };
}

function mapToAudio(dto: AudioItemDto): ActivityItem {
  return dto as any;
}

function mapToAudioPlayer(dto: AudioPlayerItemDto): ActivityItem {
  return dto as any;
}

function mapToDate(dto: DateItemDto): ActivityItem {
  return dto as any;
}

function mapToFlanker(dto: FlankerItemDto): ActivityItem {
  return dto as any;
}

function mapToGeolocation(dto: GeolocationItemDto): ActivityItem {
  return dto as any;
}

function mapToMessage(dto: MessageItemDto): ActivityItem {
  return dto as any;
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
    timer: dto.config.timer,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
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
    timer: null,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasAlert: false,
    hasScore: false,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    ...mapAdditionalText(dto.config),
  };
}

function mapToPhoto(dto: PhotoItemDto): ActivityItem {
  return dto as any;
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
    timer: dto.config.timer,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
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
    timer: dto.config.timer,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
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
    timer: null,
    order: dto.order,
    question: dto.question,
    isSkippable: dto.config.skippableItem,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: !dto.config.removeBackButton,
    hasTextResponse: false,
    canBeReset: true,
    hasTopNavigation: false,
    ...(dto.config.correctAnswerRequired && {
      validationOptions: {
        correctAnswer: dto.config.correctAnswer,
      },
    }),
  };
}

function mapToTimeRange(dto: TimeRangeItemDto): ActivityItem {
  return dto as any;
}

function mapToVideo(dto: VideoItemDto): ActivityItem {
  return dto as any;
}

function mapToSplash(splashScreen: string): ActivityItem {
  return {
    id: 'Splash',
    inputType: 'Splash',
    timer: null,
    config: {
      imageUrl: splashScreen,
    },
    order: 0,
    question: '',
    isSkippable: true,
    hasAlert: false,
    hasScore: false,
    isAbleToMoveToPrevious: true,
    hasTextResponse: false,
    canBeReset: false,
    hasTopNavigation: false,
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
    showAllAtOnce: dto.showAllAtOnce,
    isSkippable: dto.isSkippable,
    isReviewable: dto.isReviewable,
    responseIsEditable: dto.responseIsEditable,
    order: dto.ordering,
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
