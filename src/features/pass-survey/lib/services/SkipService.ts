import { AbTestResponse, Answer, PipelineItem } from '@features/pass-survey';

type Params = {
  onSkip: () => void;
  onProceed: () => void;
};

class SkipService {
  public onSkip;
  public onProceed;

  public constructor(params: Params) {
    this.onProceed = params.onProceed;
    this.onSkip = params.onSkip;
  }

  public canSkip(itemType: PipelineItem['type'], stepAnswer?: Answer) {
    if (itemType !== 'AbTest') {
      return false;
    }
    const answerValue = stepAnswer?.answer as AbTestResponse | undefined;

    const roundCompleted =
      answerValue && answerValue?.currentIndex === answerValue?.maximumIndex;

    return !roundCompleted;
  }
}

export default SkipService;
