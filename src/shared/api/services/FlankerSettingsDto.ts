export type FlankerSettingsDto = {
  general: GeneralSettings;
  practice: PracticeSettings;
  test: TestSettings;
};

type GeneralSettings = {
  instruction: string;
  buttons: Array<ButtonSetting>;
  fixation: FixationSettings | null;
  stimulusTrials: Array<StimulusSettings>;
};

type ButtonSetting = {
  name: string;
  image: string | null;
  value: number;
};

type FixationSettings = {
  image: string;
  alt: string; // value in old app
  duration: number;
};

type StimulusId = string;

type StimulusSettings = {
  id: StimulusId;
  image: string | null;
  text: string | null;
  value: number;
  weight?: number | null;
};

type PracticeSettings = {
  instruction: string;
  blocks: Array<BlockSettings>;
  stimulusDuration: number;
  threshold: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type TestSettings = {
  instruction: string;
  blocks: Array<BlockSettings>;
  stimulusDuration: number;
  randomizeOrder: boolean;
  showFeedback: boolean;
  showSummary: boolean;
};

type BlockSettings = {
  name: string;
  order: Array<StimulusId>;
};
