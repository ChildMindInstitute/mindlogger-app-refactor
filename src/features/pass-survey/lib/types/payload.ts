import { LogLine, DeviceType, TestIndex } from '@entities/abTrail';

import { Tutorial } from './tutorial';

export type ActivityItemType = 'AbTest' | 'Tutorial' | 'Splash';

type AbTestPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};
type SplashPayload = null;

type PipelinePayload = AbTestPayload | SplashPayload | Tutorial;

type PipelineItemBase = {
  type: ActivityItemType;
  payload: PipelinePayload;
  isSkippable?: boolean;
  isAbleToMoveToPrevious?: boolean;
  canBeReset?: boolean;
  hasTopNavigation?: boolean;
};

interface AbTestPipelineItem extends PipelineItemBase {
  type: 'AbTest';
  payload: AbTestPayload;
}

interface SplashPipelineItem extends PipelineItemBase {
  type: 'Splash';
  payload: null;
}

interface TutorialPipelineItem extends PipelineItemBase {
  type: 'Tutorial';
  payload: Tutorial;
}

type AbTestResponse = LogLine[];

export type PipelineItemResponse = AbTestResponse;

export type PipelineItem =
  | AbTestPipelineItem
  | SplashPipelineItem
  | TutorialPipelineItem;
