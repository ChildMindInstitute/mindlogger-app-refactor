import { DrawResult } from '@app/entities/drawer';
import { FlankerLogRecord, FlankerConfiguration } from '@app/entities/flanker';
import { LogLine, DeviceType, TestIndex } from '@entities/abTrail';

import { Tutorial } from './tutorial';

export type ActivityItemType =
  | 'AbTest'
  | 'DrawingTest'
  | 'Tutorial'
  | 'Splash'
  | 'Flanker'
  | 'TextInput';

type AbTestPayload = {
  testIndex: TestIndex;
  deviceType: DeviceType;
};
type SplashPayload = null;

type DrawingPayload = {
  imageUrl: string | null;
  backgroundImageUrl: string | null;
};
type FlankerPayload = FlankerConfiguration;

type TextInputPayload = {
  maxLength: number;
  isNumeric: boolean;
  shouldIdentifyResponse: boolean;
};

type PipelinePayload =
  | AbTestPayload
  | SplashPayload
  | Tutorial
  | DrawingPayload
  | FlankerPayload
  | TextInputPayload;

type PipelineItemBase = {
  type: ActivityItemType;
  payload: PipelinePayload;
  isSkippable?: boolean;
  isAbleToMoveToPrevious?: boolean;
  canBeReset?: boolean;
  hasTopNavigation?: boolean;
  question?: string;
  validationOptions?: {
    correctAnswer?: string;
  };
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

interface DrawingTestPipelineItem extends PipelineItemBase {
  type: 'DrawingTest';
  payload: DrawingPayload;
}

interface FlankerPipelineItem extends PipelineItemBase {
  type: 'Flanker';
  payload: FlankerConfiguration;
}

export interface TextInputPipelineItem extends PipelineItemBase {
  type: 'TextInput';
  payload: TextInputPayload;
}

type AbTestResponse = LogLine[];

type DrawingTestResponse = DrawResult;

type FlankerResponse = Array<FlankerLogRecord>;

type TextInputResponse =
  | {
      text: string;
      shouldIdentifyResponse: boolean;
    }
  | undefined;

export type PipelineItemResponse =
  | AbTestResponse
  | FlankerResponse
  | DrawingTestResponse
  | TextInputResponse;

export type PipelineItem =
  | AbTestPipelineItem
  | SplashPipelineItem
  | TutorialPipelineItem
  | DrawingTestPipelineItem
  | FlankerPipelineItem
  | TextInputPipelineItem;
