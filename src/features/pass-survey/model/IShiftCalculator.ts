export interface IStepSkipper {
  shouldSkipStep: (step: number) => boolean;
}

export interface IShiftCalculator {
  calculateShiftForForwards: (inputStep?: number) => number;
  calculateShiftForBackwards: (inputStep?: number) => number;
}
