import {
  AbTestPipelineItem,
  ActivityItemType,
  CheckboxPipelineItem,
  DrawingTestPipelineItem,
  FlankerPipelineItem,
  GeolocationPipelineItem,
  NumberSelectPipelineItem,
  PhotoPipelineItem,
  PipelineItem,
  TimeRangePipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
  SplashPipelineItem,
  TextInputPipelineItem,
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

interface TextInputActivityItem extends ActivityItemBase {
  type: 'TextInput';
  pipelineItem: TextInputPipelineItem;
}

interface AbTestActivityItem extends ActivityItemBase {
  type: 'AbTest';
  pipelineItem: AbTestPipelineItem;
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

export type ActivityItem =
  | TextInputActivityItem
  | AbTestActivityItem
  | DrawingTestActivityItem
  | FlankerActivityItem
  | SliderActivityItem
  | NumberSelectActivityItem
  | CheckboxActivityItem
  | TimeRangeActivityItem
  | RadioActivityItem
  | GeolocationActivityItem
  | PhotoActivityItem
  | VideoActivityItem
  | SplashActivityItem;
