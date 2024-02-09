import { AbPayload, AbTestPayload } from '@app/abstract/lib';

import { PipelineItem } from '../lib';

export const getAbTrailsPipeline = (id: string, abPayload: AbPayload, isLast: boolean): PipelineItem[] => {
  const getTutorialPipelineItem = (testPayload: AbTestPayload): PipelineItem => {
    return {
      id,
      type: 'Tutorial',
      payload: {
        type: 'AbTutorial',
        tutorials: abPayload.tutorials,
        test: testPayload,
      },
      timer: null,
      canBeReset: false,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  const getTestPipelineItem = (): PipelineItem => {
    return {
      id,
      type: 'AbTest',
      payload: {
        config: abPayload.config,
        nodes: abPayload.nodes,
        deviceType: abPayload.deviceType,
        isLast,
      },
      canBeReset: false,
      timer: null,
      isSkippable: false,
      isAbleToMoveBack: false,
    };
  };

  const testItem = getTestPipelineItem();

  const tutorialItem = getTutorialPipelineItem(testItem.payload as AbTestPayload);

  return [tutorialItem, testItem];
};
