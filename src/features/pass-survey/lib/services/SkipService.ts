import { NoParamVoidFunction } from '@app/abstract/lib/types/primitive';

import { Answer } from '../hooks/useActivityStorageRecord';
import { AbTestResponse, PipelineItemType } from '../types/payload';

type Params = {
  onSkip: NoParamVoidFunction;
  onProceed: NoParamVoidFunction;
};

export class SkipService {
  private readonly onSkip: NoParamVoidFunction;
  private readonly onProceed: NoParamVoidFunction;

  public constructor(params: Params) {
    this.onProceed = params.onProceed;
    this.onSkip = params.onSkip;
  }

  public skip() {
    this.onSkip();
  }

  public proceed() {
    this.onProceed();
  }

  public canSkip(itemType: PipelineItemType, stepAnswer?: Answer) {
    switch (itemType) {
      case 'AbTest': {
        const answerValue = stepAnswer?.answer as AbTestResponse | undefined;

        const roundCompleted =
          answerValue &&
          answerValue?.currentIndex === answerValue?.maximumIndex;

        return !roundCompleted;
      }
      default:
        return false;
    }
  }
}
