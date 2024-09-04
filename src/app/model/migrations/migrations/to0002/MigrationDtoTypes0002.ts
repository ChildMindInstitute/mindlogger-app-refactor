export type {
  AppletDetailsDto,
  AppletDetailsResponse,
} from '../to0001/MigrationDtoTypes0001';

export type ImageUrl = string;

type ResponseType = 'flanker';

export type StringOrNull = string | null;

type StimulusConfigId = string;

type StimulusConfigurationDto = {
  id: StimulusConfigId;
  image: StringOrNull;
  text: string;
  value: number | null;
  weight?: number | null;
};

type BlockConfigurationDto = {
  name: string;
  order: Array<StimulusConfigId>;
};

type ButtonConfigurationDto = {
  text: string;
  image: StringOrNull;
  value: number;
};

type SamplingMethod = 'randomize-order' | 'fixed-order';

type BlockType = 'test' | 'practice';

export type FlankerItemSettingsDto = {
  stimulusTrials: Array<StimulusConfigurationDto>;
  blocks: Array<BlockConfigurationDto>;
  buttons: Array<ButtonConfigurationDto>;
  nextButton: string;
  fixationDuration: number;
  fixationScreen: { value: string; image: string };
  minimumAccuracy?: number;
  sampleSize: number;
  samplingMethod: SamplingMethod;
  showFeedback: boolean;
  showFixation: boolean;
  showResults: boolean;
  trialDuration: number;
  isLastPractice: boolean;
  isFirstPractice: boolean;
  isLastTest: boolean;
  blockType: BlockType;
};

type FlankerConfiguration = FlankerItemSettingsDto;

type FlankerAnswerSettings = null;

type ActivityItemDtoBase = {
  id: string;
  name: string;
  config: unknown;
  question: string;
  responseType: ResponseType;
  responseValues: unknown;
  isHidden: boolean;
  order: number;
  timer: number | null;
  conditionalLogic: unknown;
};

export interface FlankerItemDto extends ActivityItemDtoBase {
  responseType: 'flanker';
  config: FlankerConfiguration;
  responseValues: FlankerAnswerSettings;
}

export type ActivityItemDto = FlankerItemDto;

export type ActivityDto = {
  id: string;
  name: string;
  description: string;
  splashScreen: ImageUrl | null;
  image: ImageUrl | null;
  showAllAtOnce: boolean;
  isSkippable: boolean;
  isReviewable: boolean;
  isHidden: boolean;
  responseIsEditable: boolean;
  order: number;
  items: ActivityItemDto[];
  scoresAndReports?: unknown;
};

export type ActivityResponse = {
  result: ActivityDto;
};

export type AppletDto = {
  id: string;
  image: ImageUrl | null;
  displayName: string;
  description: string;
  theme: unknown;
  version: string;
  about: string;
  watermark: ImageUrl | null;
};

export type AppletsResponse = {
  result: AppletDto[];
};
