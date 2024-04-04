import { AbTestResponse, Answer, PipelineItem } from '@features/pass-survey';

type Params = {
  onSkip: () => void;
  onProceed: () => void;
};

class SkipService {
  private readonly onSkip: Params['onSkip'];
  private readonly onProceed: Params['onProceed'];

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

  public canSkip(itemType: PipelineItem['type'], stepAnswer?: Answer) {
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
