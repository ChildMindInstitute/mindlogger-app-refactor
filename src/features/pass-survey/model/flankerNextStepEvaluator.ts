import { FlankerItemSettings } from '@app/abstract/lib/types/flanker';

import {
  FlankerPayload,
  FlankerResponse,
  PipelineItem,
} from '../lib/types/payload';

export const evaluateFlankerNextStep = (
  gameResult: FlankerResponse | null,
  currentIndex: number,
  items: PipelineItem[],
): number | null => {
  if (!gameResult) {
    return null;
  }

  const currentItem: PipelineItem = items[currentIndex];

  const itemConfiguration: FlankerItemSettings =
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

  for (const logRecord of gameResult.records) {
    if (logRecord.tag !== 'trial') {
      continue;
    }

    totalCount++;

    if (logRecord.correct) {
      correctCount++;
    }
  }

  const minimumAccuracy = itemConfiguration.minimumAccuracy;
  if (!minimumAccuracy && minimumAccuracy !== 0 ) {
    return currentIndex + 1;
  }

  if (correctCount * 100 >= totalCount * minimumAccuracy) {
    const lastPracticeIndex = items.findIndex(
      x => !!x.payload && (x.payload as FlankerItemSettings).isLastPractice,
    );
    return lastPracticeIndex + 1;
  }

  return currentIndex + 1;
};
