import { DeviceType, TestIndex } from '@entities/abTrail';

import { PipelineItem } from '../lib';

export const getAbTrailsPipeline = (deviceType: DeviceType): PipelineItem[] => {
  const getTutorialPipelineItems = (testIndex: TestIndex): PipelineItem => {
    return {
      type: 'Tutorial',
      payload: {
        type: 'AbTrails',
        testIndex,
        deviceType,
      },
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveToPrevious: false,
    };
  };

  const getTestPipelineItem = (testIndex: TestIndex): PipelineItem => {
    return {
      type: 'AbTest',
      payload: {
        testIndex,
        deviceType,
      },
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveToPrevious: false,
    };
  };

  return [
    getTutorialPipelineItems(0),
    getTestPipelineItem(0),

    getTutorialPipelineItems(1),
    getTestPipelineItem(1),

    getTutorialPipelineItems(2),
    getTestPipelineItem(2),

    getTutorialPipelineItems(3),
    getTestPipelineItem(3),
  ];
};
