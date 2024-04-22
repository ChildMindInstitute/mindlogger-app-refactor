export type ActivityItemType =
  | 'StabilityTracker'
  | 'AbTrails'
  | 'DrawingTest'
  | 'Splash'
  | 'Flanker'
  | 'TextInput'
  | 'NumberSelect'
  | 'Slider'
  | 'Radio'
  | 'Geolocation'
  | 'TimeRange'
  | 'AudioPlayer'
  | 'StackedCheckbox'
  | 'StackedRadio'
  | 'StackedSlider'
  | 'Message'
  | 'Audio'
  | 'Photo'
  | 'Video'
  | 'Checkbox'
  | 'Date'
  | 'Time';

type ZeroBasedIndex = string;

export type MediaFile = {
  uri: string;
  type: string;
  fileName: string;
};

type PhotoAnswer = {
  answer?: {
    size: number;
    fromLibrary: boolean;
  } & MediaFile;
  additionalAnswer?: string;
};

type VideoAnswer = {
  answer?: {
    size: number;
    fromLibrary: boolean;
  } & MediaFile;
  additionalAnswer?: string;
};

type Answer = PhotoAnswer | VideoAnswer | undefined;

type Answers = Record<ZeroBasedIndex, Answer>;

export type PipelineItem = {
  type: ActivityItemType;
};

type PhotoItemAnswer = {
  type: 'Photo';
  value: PhotoAnswer;
};

type VideoItemAnswer = {
  type: 'Video';
  value: VideoAnswer;
};

type PipelineItemAnswerBase = PhotoItemAnswer | VideoItemAnswer;

type SetAnswerAction = {
  type: 'SET_ANSWER';
  payload: {
    answer: PipelineItemAnswerBase;
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type GoNextAction = {
  type: 'NEXT';
  payload: {
    activityId: string;
    activityItemId: string;
    date: number;
  };
};

type UserAction = GoNextAction | SetAnswerAction;

export type ActivityState = {
  step: number;
  items: PipelineItem[];
  answers: Answers;
  actions: UserAction[];
};
