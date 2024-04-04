import { PipelineItem } from '@features/pass-survey';

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

  public isSkippableItem(itemType: PipelineItem['type']) {
    return itemType === 'AbTest';
  }
}

export default SkipService;
