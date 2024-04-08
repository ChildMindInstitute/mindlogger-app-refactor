import { AbTestResponse, Answer, PipelineItem } from '@features/pass-survey';

type NoParamVoidFunction = () => void;

type PipelineItemType = PipelineItem['type'];

type Params = {
  onSkip: NoParamVoidFunction;
  onProceed: NoParamVoidFunction;
};

class SkipService {
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

export default SkipService;
