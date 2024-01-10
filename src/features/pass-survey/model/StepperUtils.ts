import PipelineVisibilityChecker from './PipelineVisibilityChecker';
import { ActivityState } from '../lib';

class StepperUtils {
  private activityState: ActivityState;

  constructor(activityState: ActivityState) {
    this.activityState = activityState;
  }

  public getNextStepShift(direction: 'forwards' | 'backwards'): number {
    const { step, items, answers } = this.activityState;

    let shift = 1;

    const visibilityChecker = PipelineVisibilityChecker(items, answers);

    while (true) {
      let nextStep = direction === 'forwards' ? step + shift : step - shift;

      if (nextStep > items.length - 1) {
        shift = items.length;
        break;
      }

      if (nextStep < 0) {
        break;
      }

      const isItemVisible = visibilityChecker.isItemVisible(nextStep);

      if (isItemVisible) {
        break;
      } else {
        shift++;
      }
    }

    return shift;
  }
}

export default StepperUtils;
