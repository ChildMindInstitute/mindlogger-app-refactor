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
} from '@app/shared/api';

import { ActivityDetails, ActivityItem } from '../lib';

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
  };
}

function mapToAbTest(dto: AbTestItemDto): ActivityItem {
  return dto as any;
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
  return dto as any;
}

function mapToStackedCheckboxes(dto: MultiSelectionRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToNumberSelect(dto: NumberSelectionItemDto): ActivityItem {
  return dto as any;
}

function mapToPhoto(dto: PhotoItemDto): ActivityItem {
  return dto as any;
}

function mapToRadio(dto: SingleSelectionItemDto): ActivityItem {
  return dto as any;
}

function mapToStackedRadio(dto: SingleSelectionRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToSlider(dto: SliderSelectionItemDto): ActivityItem {
  return dto as any;
}

function mapToStackedSlider(dto: SliderRowsItemDto): ActivityItem {
  return dto as any;
}

function mapToTextInput(dto: TextItemDto): ActivityItem {
  return dto as any;
}

function mapToTimeRange(dto: TimeRangeItemDto): ActivityItem {
  return dto as any;
}

function mapToVideo(dto: VideoItemDto): ActivityItem {
  return dto as any;
}

export function mapToActivity(dto: ActivityDto): ActivityDetails {
  return {
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
}
