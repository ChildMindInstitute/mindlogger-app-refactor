export type StringOrNull = string | null;

export type FlankerConfiguration = {
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

export type SamplingMethod = 'randomize-order' | 'fixed-order';

export type BlockType = 'test' | 'practice';

type StimulusConfigId = string;

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

export type FlankerWebViewConfiguration = {
  trials: Array<TestTrial>;
  buttons: Array<TestButtons>;
  fixationDuration: number;
  fixation: string;
  showFixation: boolean;
  showFeedback: boolean;
  showResults: boolean;
  trialDuration: number;
  samplingMethod: SamplingMethod;
  samplingSize: number;
  buttonLabel: string;
  minimumAccuracy: number;
  continueText: Array<string>;
  restartText: Array<string>;
};

export type StimulusScreen = {
  id: StimulusConfigId;
  correctChoice: number;
  stimulus: { en: string };
  weight: number;
};

export type TestChoice = {
  value: number;
  name: { en: string };
};

export type TestTrial = StimulusScreen & {
  choices: Array<TestChoice>;
};

type TestButtons = {
  name: { en: string };
  image: StringOrNull;
  value: number;
};

export type FlankerNativeIOSConfiguration = FlankerWebViewConfiguration;
