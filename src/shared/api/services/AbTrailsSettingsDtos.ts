export type AbTrailsItemSettingsDto = {
  deviceType: 'mobile' | 'tablet';
  nodes: NodesSettingsDto;
  tutorials: TutorialSettingsDto;
};

type NodesSettingsDto = {
  radius: number;
  fontSize: number;
  fontSizeBeginEnd?: number | null;
  beginWordLength?: number | null;
  endWordLength?: number | null;
  nodes: Array<NodeDto>;
};

type NodeDto = {
  orderIndex: number;
  cx: number;
  cy: number;
  label: string;
};

type TutorialSettingsDto = {
  tutorials: Array<TutorialDto>;
};

type TutorialDto = {
  nodeLabel: string;
  text: string;
};
