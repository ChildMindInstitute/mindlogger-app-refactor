import { PipelineVisibilityChecker } from './PipelineVisibilityChecker';
import { ShiftCalculator } from './ShiftCalculator';
import { ActivityState } from '../lib/hooks/useActivityStorageRecord';

export class StepperUtils {
  private activityState: ActivityState;
  private shiftCalculator: ShiftCalculator;

  constructor(activityState: ActivityState) {
    this.activityState = activityState;
    this.shiftCalculator = new ShiftCalculator(
      {
        shouldSkipStep: (step: number) => this.shouldSkipStep(step),
      },
      activityState.items.length,
    );
  }

  private shouldSkipStep(step: number) {
    const { items, answers } = this.activityState;
    const visibilityChecker = PipelineVisibilityChecker(items, answers);
    const isItemVisible = visibilityChecker.isItemVisible(step);

    return !isItemVisible;
  }

  public getNextStepShift() {
    const { step } = this.activityState;

    return this.shiftCalculator.calculateShiftForForwards(step);
  }

  public getPreviousStepShift() {
    const { step } = this.activityState;

    return this.shiftCalculator.calculateShiftForBackwards(step);
  }
}
