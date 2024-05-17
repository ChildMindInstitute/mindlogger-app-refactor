import { StringOrNull } from './primitive';

export type SamplingMethod = 'randomize-order' | 'fixed-order';

export type BlockType = 'test' | 'practice';

export type StimulusConfigId = string;

export type FlankerItemSettings = {
  stimulusTrials: Array<StimulusConfiguration>;
  blocks: Array<BlockConfiguration>;
  buttons: Array<ButtonConfiguration>;
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

export type StimulusConfiguration = {
  id: StimulusConfigId;
  image: StringOrNull;
  text: string;
  value: number | null;
  weight?: number | null;
};

export type BlockConfiguration = {
  name: string;
  order: Array<StimulusConfigId>;
};

export type ButtonConfiguration = {
  text: string;
  image: StringOrNull;
  value: number;
};
