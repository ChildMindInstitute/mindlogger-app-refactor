import { DeviceType, TestIndex } from '@entities/abTrail';

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
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveToPrevious: false,
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
      isSkippable: false,
      isAbleToMoveToPrevious: false,
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
