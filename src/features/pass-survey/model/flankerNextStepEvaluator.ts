import { FlankerConfiguration } from '@app/entities/flanker';

import { FlankerPayload, FlankerResponse, PipelineItem } from '../lib';

export const evaluateFlankerNextStep = (
  gameResult: FlankerResponse | null,
  currentIndex: number,
  items: PipelineItem[],
): number | null => {
  if (!gameResult) {
    return null;
  }

  const currentItem: PipelineItem = items[currentIndex];

  const itemConfiguration: FlankerConfiguration =
    currentItem.payload as FlankerPayload;

  if (itemConfiguration.blockType === 'test') {
    return itemConfiguration.isLastTest ? null : currentIndex + 1;
  }

  if (
    itemConfiguration.blockType === 'practice' &&
    itemConfiguration.isLastPractice
  ) {
    return currentIndex + 1;
  }

  let correctCount: number = 0;

  let totalCount: number = 0;

  for (let logRecord of gameResult.records) {
    if (logRecord.tag !== 'trial') {
      continue;
    }

    totalCount++;

    if (logRecord.correct) {
      correctCount++;
    }
  }

  const minimumAccuracy = itemConfiguration.minimumAccuracy;

  if (!minimumAccuracy) {
    return currentIndex + 1;
  }

  if (correctCount * 100 >= totalCount * minimumAccuracy) {
    const lastPracticeIndex = items.findIndex(
      x => !!x.payload && (x.payload as FlankerConfiguration).isLastPractice,
    );
    return lastPracticeIndex + 1;
  }

  return currentIndex + 1;
};
