import {
  IShiftCalculator,
  IStepSkipper,
} from '@features/pass-survey/model/IShiftCalculator.ts';

export class ShiftCalculator implements IShiftCalculator {
  private skipper: IStepSkipper;
  private arrayLength: number;

  constructor(skipper: IStepSkipper, arrayLength: number) {
    this.skipper = skipper;
    this.arrayLength = arrayLength;
  }

  calculateShiftForForwards(inputStep: number = 0): number {
    let result = 0;

    let shift = 1;

    const exceedRangeShift = this.arrayLength - inputStep;

    while (true) {
      const nextStep = inputStep + shift;

      if (nextStep >= this.arrayLength) {
        result = exceedRangeShift;
        break;
      }

      if (this.skipper.shouldSkipStep(nextStep)) {
        shift++;
      } else {
        result = shift;
        break;
      }
    }

    return result;
  }

  calculateShiftForBackwards(inputStep: number = 0): number {
    let result = 0;

    let shift = 1;

    const noShift = 0;

    while (true) {
      const previousStep = inputStep - shift;

      if (previousStep < 0) {
        result = noShift;
        break;
      }

      if (this.skipper.shouldSkipStep(previousStep)) {
        shift++;
      } else {
        result = shift;
        break;
      }
    }

    return result;
  }
}
