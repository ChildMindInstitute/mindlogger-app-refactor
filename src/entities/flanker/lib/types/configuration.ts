export type StringOrNull = string | null;

export type FlankerConfiguration = {
  stimulusTrials: Array<StimulusConfiguration>; // dto - trials?
  blocks: Array<BlockConfiguration>;
  buttons: Array<ButtonConfiguration>;
  nextButton: string;
  fixationDuration: number;
  fixationScreen: { value: string; image: string };
  minimumAccuracy?: number;
  sampleSize: number;
  samplingMethod: SamplingMethod;
  showFeedback: boolean; // ensure it's boolean in dto
  showFixation: boolean; // ensure it's boolean in dto
  showResults: boolean; // ensure it's boolean in dto
  trialDuration: number;
  isLastPractice?: boolean; // dto lastPractice?
  isLastTest?: boolean; //dto lastTest?
  blockType: BlockType;
};

export type SamplingMethod = 'randomize-order' | 'fixed-order';

type BlockType = 'test' | 'practice';

type StimulusConfigId = string;

export type StimulusConfiguration = {
  id: StimulusConfigId;
  image: StringOrNull;
  text: string; // dto - name?
  value: number | null;
  weight?: number | null;
};

export type BlockConfiguration = {
  name: string;
  order: Array<StimulusConfigId>;
};

export type ButtonConfiguration = {
  text: string; //dto name?
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
