import { DeviceType, TestIndex } from '@entities/abTrail';
import { StabilityTrackerConfig } from '@entities/activity';
import { TestIndex as StabilityTrackerTestIndex } from '@entities/stabilityTracker';

import { PipelineItem } from '../lib';

export const getAbTrailsPipeline = (
  deviceType: DeviceType,
  id: string,
): PipelineItem[] => {
  const getTutorialPipelineItem = (testIndex: TestIndex): PipelineItem => {
    return {
      type: 'Tutorial',
      payload: {
        type: 'AbTrails',
        testIndex,
        deviceType,
      },
      timer: null,
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  const getTestPipelineItem = (testIndex: TestIndex): PipelineItem => {
    return {
      id,
      type: 'AbTest',
      payload: {
        testIndex,
        deviceType,
      },
      canBeReset: false,
      timer: null,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  return [
    getTutorialPipelineItem(0),
    getTestPipelineItem(0),

    getTutorialPipelineItem(1),
    getTestPipelineItem(1),

    getTutorialPipelineItem(2),
    getTestPipelineItem(2),

    getTutorialPipelineItem(3),
    getTestPipelineItem(3),
  ];
};

export const getStabilityTrackerPipeline = (
  config: StabilityTrackerConfig,
  id: string,
): PipelineItem[] => {
  const getTutorialPipelineItem = (
    testIndex: StabilityTrackerTestIndex,
  ): PipelineItem => {
    return {
      type: 'Tutorial',
      payload: {
        type: 'StabilityTracker',
        testIndex,
      },
      timer: null,
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  const getTestPipelineItem = (
    testIndex: StabilityTrackerTestIndex,
  ): PipelineItem => {
    return {
      id,
      type: 'StabilityTracker',
      payload: {
        ...config,
        testIndex: testIndex,
        phase: testIndex === 0 ? 'trial' : 'focus-phase',
      },
      canBeReset: false,
      timer: null,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  return [
    getTutorialPipelineItem(0),
    getTestPipelineItem(0),

    getTutorialPipelineItem(1),
    getTestPipelineItem(1),
  ];
};
