import { BlockType, SamplingMethod } from '@app/abstract/lib';

export type StringOrNull = string | null;

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

type StimulusConfigId = string;

export type StimulusConfigurationDto = {
  id: StimulusConfigId;
  image: StringOrNull;
  text: string;
  value: number | null;
  weight?: number | null;
};

export type BlockConfigurationDto = {
  name: string;
  order: Array<StimulusConfigId>;
};

export type ButtonConfigurationDto = {
  text: string;
  image: StringOrNull;
  value: number;
};
