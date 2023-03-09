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
  showFeedback: boolean;
  showFixation: boolean;
  showResults: boolean;
  trialDuration: number;
  isLastPractice?: boolean; // dto lastPractice?
  isLastTest?: boolean; //dto lastTest?
  blockType: BlockType;
};

export type SamplingMethod = 'randomize-order' | 'fixed-order';

type BlockType = 'test' | 'practice';

type TrialId = string;

export type StimulusConfiguration = {
  id: TrialId;
  image: StringOrNull;
  text: string; // dto - name?
  value: number | null;
  weight?: number | null;
};

export type BlockConfiguration = {
  name: string;
  order: Array<TrialId>;
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

export type TestScreen = {
  id: TrialId;
  correctChoice: number;
  stimulus: { en: string };
  weight: number;
};

export type TestChoice = {
  value: number;
  name: { en: string };
};

export type TestTrial = TestScreen & {
  choices: Array<TestChoice>;
};

type TestButtons = {
  name: { en: string };
  image: StringOrNull;
  value: number;
};
