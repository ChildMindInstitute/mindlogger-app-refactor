export interface IStepSkipper {
  shouldSkipStep: (step: number) => boolean;
}

class ShiftCalculator {
  private skipper: IStepSkipper;
  private arrayLength: number;

  constructor(skipper: IStepSkipper, arrayLength: number) {
    this.skipper = skipper;
    this.arrayLength = arrayLength;
  }

  calculateShift(
    fromIndex: number = 0,
    direction: 'forwards' | 'backwards' = 'forwards',
  ): number {
    let result = 0;

    let shift = 1;

    while (true) {
      let nextStep =
        direction === 'forwards' ? fromIndex + shift : fromIndex - shift;

      if (nextStep < 0) {
        break;
      }

      if (nextStep >= this.arrayLength) {
        result = this.arrayLength - fromIndex;
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
}

export default ShiftCalculator;
