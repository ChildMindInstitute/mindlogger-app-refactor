export type AbPayload = {
  config: TestScreenConfig;
  nodes: TestNodes;
  deviceType: DeviceType;
  tutorials: Array<TutorialRecord>;
};

export type AbTutorialPayload = {
  tutorials: Array<TutorialRecord>;
  test: AbTestPayload;
};

export type AbTestPayload = {
  config: TestScreenConfig;
  nodes: TestNodes;
  isLast: boolean;
  deviceType: DeviceType;
};

type TestNodes = Array<TestNode>;

export type TestNode = {
  orderIndex: number;
  cx: number;
  cy: number;
  label: string;
};

type TestScreenConfig = {
  radius: number;
  fontSize: number;
  fontSizeBeginEnd?: number | null;
  beginWordLength?: number | null;
  endWordLength?: number | null;
};

export type TutorialRecord = {
  text: string;
  nodeLabel?: number | string;
};

export type DeviceType = 'mobile' | 'tablet';
