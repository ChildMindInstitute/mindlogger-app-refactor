import {
  AbTestPipelineItem,
  UnityPipelineItem,
  ActivityItemType,
  AudioPipelineItem,
  AudioPlayerPipelineItem,
  CheckboxPipelineItem,
  DatePipelineItem,
  DrawingTestPipelineItem,
  FlankerPipelineItem,
  GeolocationPipelineItem,
  MessagePipelineItem,
  NumberSelectPipelineItem,
  ParagraphTextPipelineItem,
  PhotoPipelineItem,
  PipelineItem,
  RadioPipelineItem,
  RequestHealthRecordDataPipelineItem,
  SliderPipelineItem,
  SplashPipelineItem,
  StabilityTrackerPipelineItem,
  StackedCheckboxPipelineItem,
  StackedRadioPipelineItem,
  StackedSliderPipelineItem,
  TextInputPipelineItem,
  TimePipelineItem,
  TimeRangePipelineItem,
  VideoPipelineItem,
} from './payload';

type ActivityItemBase = {
  type: Exclude<ActivityItemType, 'Tutorial'>;
  pipelineItem: PipelineItem;
};

interface SplashActivityItem extends ActivityItemBase {
  type: 'Splash';
  pipelineItem: SplashPipelineItem;
}

interface ParagraphTextActivityItem extends ActivityItemBase {
  type: 'ParagraphText';
  pipelineItem: ParagraphTextPipelineItem;
}

interface TextInputActivityItem extends ActivityItemBase {
  type: 'TextInput';
  pipelineItem: TextInputPipelineItem;
}

interface AbTestActivityItem extends ActivityItemBase {
  type: 'AbTest';
  pipelineItem: AbTestPipelineItem;
}

interface UnityActivityItem extends ActivityItemBase {
  type: 'Unity';
  pipelineItem: UnityPipelineItem;
}

interface StabilityTrackerActivityItem extends ActivityItemBase {
  type: 'StabilityTracker';
  pipelineItem: StabilityTrackerPipelineItem;
}

interface DrawingTestActivityItem extends ActivityItemBase {
  type: 'DrawingTest';
  pipelineItem: DrawingTestPipelineItem;
}

interface FlankerActivityItem extends ActivityItemBase {
  type: 'Flanker';
  pipelineItem: FlankerPipelineItem;
}

interface SliderActivityItem extends ActivityItemBase {
  type: 'Slider';
  pipelineItem: SliderPipelineItem;
}

interface NumberSelectActivityItem extends ActivityItemBase {
  type: 'NumberSelect';
  pipelineItem: NumberSelectPipelineItem;
}

interface CheckboxActivityItem extends ActivityItemBase {
  type: 'Checkbox';
  pipelineItem: CheckboxPipelineItem;
}

interface AudioActivityItem extends ActivityItemBase {
  type: 'Audio';
  pipelineItem: AudioPipelineItem;
}

interface MessageActivityItem extends ActivityItemBase {
  type: 'Message';
  pipelineItem: MessagePipelineItem;
}

interface StackedCheckboxActivityItem extends ActivityItemBase {
  type: 'StackedCheckbox';
  pipelineItem: StackedCheckboxPipelineItem;
}

interface StackedRadioActivityItem extends ActivityItemBase {
  type: 'StackedRadio';
  pipelineItem: StackedRadioPipelineItem;
}
interface StackedSliderActivityItem extends ActivityItemBase {
  type: 'StackedSlider';
  pipelineItem: StackedSliderPipelineItem;
}

interface AudioPlayerActivityItem extends ActivityItemBase {
  type: 'AudioPlayer';
  pipelineItem: AudioPlayerPipelineItem;
}

interface TimeRangeActivityItem extends ActivityItemBase {
  type: 'TimeRange';
  pipelineItem: TimeRangePipelineItem;
}

interface RadioActivityItem extends ActivityItemBase {
  type: 'Radio';
  pipelineItem: RadioPipelineItem;
}

interface GeolocationActivityItem extends ActivityItemBase {
  type: 'Geolocation';
  pipelineItem: GeolocationPipelineItem;
}
interface PhotoActivityItem extends ActivityItemBase {
  type: 'Photo';
  pipelineItem: PhotoPipelineItem;
}

interface VideoActivityItem extends ActivityItemBase {
  type: 'Video';
  pipelineItem: VideoPipelineItem;
}

interface DateActivityItem extends ActivityItemBase {
  type: 'Date';
  pipelineItem: DatePipelineItem;
}
interface TimeActivityItem extends ActivityItemBase {
  type: 'Time';
  pipelineItem: TimePipelineItem;
}

interface RequestHealthRecordDataActivityItem extends ActivityItemBase {
  type: 'RequestHealthRecordData';
  pipelineItem: RequestHealthRecordDataPipelineItem;
}

export type ActivityItem =
  | TextInputActivityItem
  | ParagraphTextActivityItem
  | AbTestActivityItem
  | UnityActivityItem
  | StabilityTrackerActivityItem
  | DrawingTestActivityItem
  | FlankerActivityItem
  | SliderActivityItem
  | NumberSelectActivityItem
  | CheckboxActivityItem
  | AudioActivityItem
  | MessageActivityItem
  | StackedSliderActivityItem
  | StackedCheckboxActivityItem
  | StackedRadioActivityItem
  | AudioPlayerActivityItem
  | TimeRangeActivityItem
  | RadioActivityItem
  | GeolocationActivityItem
  | PhotoActivityItem
  | VideoActivityItem
  | SplashActivityItem
  | DateActivityItem
  | TimeActivityItem
  | RequestHealthRecordDataActivityItem;
