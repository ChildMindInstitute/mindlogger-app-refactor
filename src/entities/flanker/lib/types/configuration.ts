import { SamplingMethod, StimulusConfigId, StringOrNull } from '@app/abstract/lib';

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
