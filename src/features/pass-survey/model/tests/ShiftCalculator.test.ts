import { ShiftCalculator } from '../ShiftCalculator';

describe('[ShiftCalculator]', () => {
  describe('When the next step is calculated', () => {
    const TestCases = [
      {
        fromStep: 0,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 1,
      },
      {
        fromStep: 2,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 1,
      },
      {
        fromStep: 0,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 2,
      },
      {
        fromStep: 0,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
          { shouldBeSkipped: true },
          { shouldBeSkipped: false },
        ],
        expectedShift: 3,
      },
      {
        fromStep: 3,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 1,
      },
      {
        fromStep: 2,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
        ],
        expectedShift: 2,
      },
      {
        fromStep: 1,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
          { shouldBeSkipped: true },
        ],
        expectedShift: 3,
      },
    ];

    TestCases.forEach(({ fromStep, list, expectedShift }) => {
      it(`should return ${expectedShift} if the current item is at ${fromStep} step`, () => {
        const shiftCalculator = new ShiftCalculator(
          {
            shouldSkipStep: step => list[step].shouldBeSkipped,
          },
          list.length,
        );

        const actualShift = shiftCalculator.calculateShiftForForwards(fromStep);

        expect(actualShift).toBe(expectedShift);
      });
    });
  });

  describe('When the previous step is calculated', () => {
    const TestCases = [
      {
        fromStep: 3,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 1,
      },
      {
        fromStep: 2,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 1,
      },
      {
        fromStep: 3,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
          { shouldBeSkipped: false },
        ],
        expectedShift: 2,
      },
      {
        fromStep: 3,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: true },
          { shouldBeSkipped: true },
          { shouldBeSkipped: false },
        ],
        expectedShift: 3,
      },
      {
        fromStep: 0,
        list: [
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
          { shouldBeSkipped: false },
        ],
        expectedShift: 0,
      },
    ];

    TestCases.forEach(({ fromStep, list, expectedShift }) => {
      it(`should return ${expectedShift} if the current item is at ${fromStep} step`, () => {
        const shiftCalculator = new ShiftCalculator(
          {
            shouldSkipStep: step => list[step].shouldBeSkipped,
          },
          list.length,
        );

        const actualShift =
          shiftCalculator.calculateShiftForBackwards(fromStep);

        expect(actualShift).toBe(expectedShift);
      });
    });
  });
});
