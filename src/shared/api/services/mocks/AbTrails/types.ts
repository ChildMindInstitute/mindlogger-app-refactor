export type TutorialRecord = {
  text: string;
  nodeLabel?: number | string;
};

export type DeviceType = 'Phone' | 'Tablet';

export type TestIndex = 0 | 1 | 2 | 3;

export type TutorialPayload = Array<TutorialRecord>;

export type DeviceTutorials = Record<TestIndex, TutorialPayload>;

export type Tutorials = Record<DeviceType, DeviceTutorials>;

export type TestNode = {
  orderIndex: number;
  cx: number;
  cy: number;
  label: string;
};

type TestNodes = Array<TestNode>;

type TestScreenConfig = {
  radius: number;
  fontSize: number;
  fontSizeBeginEnd?: number | null;
  beginWordLength?: number | null;
  endWordLength?: number | null;
};

export type TestScreenPayload = {
  config: TestScreenConfig;
  nodes: TestNodes;
};

export type DeviceTests = Record<TestIndex, TestScreenPayload>;

export type Tests = Record<DeviceType, DeviceTests>;
