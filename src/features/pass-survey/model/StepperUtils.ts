import PipelineVisibilityChecker from './PipelineVisibilityChecker';
import ShiftCalculator, { IStepSkipper } from './ShiftCalculator';
import { ActivityState } from '../lib';

class StepperUtils implements IStepSkipper {
  private activityState: ActivityState;
  private shiftCalculator: ShiftCalculator;

  constructor(activityState: ActivityState) {
    this.activityState = activityState;
    this.shiftCalculator = new ShiftCalculator(
      this,
      activityState.items.length,
    );
  }

  public shouldSkipStep(step: number) {
    const { items, answers } = this.activityState;
    const visibilityChecker = PipelineVisibilityChecker(items, answers);
    const isItemVisible = visibilityChecker.isItemVisible(step);

    return !isItemVisible;
  }

  public getNextStepShift() {
    const { step } = this.activityState;

    return this.shiftCalculator.calculateShift(step, 'forwards');
  }

  public getPreviousStepShift() {
    const { step } = this.activityState;

    return this.shiftCalculator.calculateShift(step, 'backwards');
  }
}

export default StepperUtils;
