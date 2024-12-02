import {
  isBetweenValues,
  isOutsideOfValues,
  isEqualToValue,
  isGreaterThan,
  isLessThan,
  includesValue,
  doesNotIncludeValue,
} from './conditions';

describe('[isBetweenValues] function', () => {
  const inRangeTestCases = [
    { input: 25, min: 20, max: 30 },
    { input: 1, min: 0, max: 2 },
    { input: 0, min: -2, max: 2 },
  ];

  inRangeTestCases.forEach(({ input, min, max }) => {
    it(`should return "true" when the input ${input} is between the values range: [${min}, ${max}]`, () => {
      expect(isBetweenValues(input, min, max)).toBe(true);
    });
  });

  const outsideTestCases = [
    { input: 19, min: 20, max: 30 },
    { input: 31, min: 20, max: 30 },
    { input: 20, min: 20, max: 30 },
    { input: 30, min: 20, max: 30 },
    { input: 0, min: 1, max: 3 },
  ];

  outsideTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" for the input: ${input} that is outside of values range: [${min}, ${max}]`, () => {
      expect(isBetweenValues(input, min, max)).toBe(false);
    });
  });

  const borderLineValuesTestCases = [
    { input: 20, min: 20, max: 30 },
    { input: 30, min: 20, max: 30 },
    { input: 0, min: 0, max: 5 },
  ];

  borderLineValuesTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" for the borderline value ${input} of the values range: [${min}, ${max}]`, () => {
      expect(isOutsideOfValues(input, min, max)).toBe(false);
    });
  });

  const nilTestCases = [
    { input: null, min: 20, max: 30 },
    { input: undefined, min: 20, max: 30 },
  ];

  nilTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" when input is ${input}`, () => {
      expect(isBetweenValues(input, min, max)).toBe(false);
    });
  });
});

describe('[isOutsideOfValues] function', () => {
  const outsideTestCases = [
    { input: 19, min: 20, max: 30 },
    { input: 31, min: 20, max: 30 },
    { input: 0, min: 2, max: 10 },
  ];

  outsideTestCases.forEach(({ input, min, max }) => {
    it(`should return "true" for the input: ${input} that is outside of the values range: [${min}, ${max}]`, () => {
      expect(isOutsideOfValues(input, min, max)).toBe(true);
    });
  });

  const inRangeTestCases = [
    { input: 25, min: 20, max: 30 },
    { input: 1, min: 0, max: 2 },
    { input: 0, min: -2, max: 2 },
  ];

  inRangeTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" when the input ${input} is between the values range: [${min}, ${max}]`, () => {
      expect(isOutsideOfValues(input, min, max)).toBe(false);
    });
  });

  const borderLineValuesTestCases = [
    { input: 20, min: 20, max: 30 },
    { input: 30, min: 20, max: 30 },
    { input: 0, min: 0, max: 30 },
  ];

  borderLineValuesTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" for the borderline value ${input} of the values range: [${min}, ${max}]`, () => {
      expect(isOutsideOfValues(input, min, max)).toBe(false);
    });
  });

  const nilTestCases = [
    { input: null, min: 20, max: 30 },
    { input: undefined, min: 20, max: 30 },
  ];

  nilTestCases.forEach(({ input, min, max }) => {
    it(`should return "false" when input is ${input}`, () => {
      expect(isOutsideOfValues(input, min, max)).toBe(false);
    });
  });
});

describe('[isEqualToValue] function', () => {
  const object = {};
  const sameValueTestCases = [
    { a: 1, b: 1 },
    { a: 'Hello', b: 'Hello' },
    { a: 0, b: 0 },
    { a: object, b: object },
  ];

  sameValueTestCases.forEach(({ a, b }) => {
    it(`should return "true" when comparing same values ${a} and ${b}`, () => {
      expect(isEqualToValue(a, b)).toBe(true);
    });
  });

  const differentValueTestCases = [
    { a: 1, b: 2 },
    { a: 'Hello', b: 'Bye' },
    { a: 0, b: -1 },
  ];

  differentValueTestCases.forEach(({ a, b }) => {
    it(`should return "false" when comparing different values: ${a} and ${b}`, () => {
      expect(isEqualToValue(a, b)).toBe(false);
    });
  });

  const nilTestCases = [
    { a: null, b: 2 },
    { a: undefined, b: 4 },
  ];

  nilTestCases.forEach(({ a, b }) => {
    it(`should return "false" when the input is ${a}`, () => {
      expect(isEqualToValue(a, b)).toBe(false);
    });
  });
});

describe('[isGreaterThan] function', () => {
  const greaterTestCases = [
    { a: 1, b: 0 },
    { a: 0, b: -1 },
    { a: -1, b: -99 },
    { a: Infinity, b: 200000 },
  ];

  greaterTestCases.forEach(({ a, b }) => {
    it(`should return "true" when the ${a} is greater than ${b}`, () => {
      expect(isGreaterThan(a, b)).toBe(true);
    });
  });

  const lesserTestCases = [
    { a: 0, b: 1 },
    { a: -1, b: 0 },
    { a: -99, b: -2 },
    { a: 200000, b: Infinity },
  ];

  lesserTestCases.forEach(({ a, b }) => {
    it(`should return "false" when ${a} is lesser than ${b}`, () => {
      expect(isGreaterThan(a, b)).toBe(false);
    });
  });

  const equalTestCases = [
    { a: 0, b: 0 },
    { a: 1, b: 1 },
    { a: -1, b: -1 },
    { a: Infinity, b: Infinity },
  ];

  equalTestCases.forEach(({ a, b }) => {
    it(`should return "false" when ${a} and ${b} are equal`, () => {
      expect(isGreaterThan(a, b)).toBe(false);
    });
  });

  const nilTestCases = [
    { a: null, b: 2 },
    { a: undefined, b: 4 },
  ];

  nilTestCases.forEach(({ a, b }) => {
    it(`should return "false" when the input is ${a}`, () => {
      expect(isGreaterThan(a, b)).toBe(false);
    });
  });
});

describe('[isLessThan] function', () => {
  const greaterTestCases = [
    { a: 1, b: 0 },
    { a: 0, b: -1 },
    { a: -1, b: -99 },
    { a: Infinity, b: 200000 },
  ];

  greaterTestCases.forEach(({ a, b }) => {
    it(`should return "false" when the ${a} is greater than ${b}`, () => {
      expect(isLessThan(a, b)).toBe(false);
    });
  });

  const lesserTestCases = [
    { a: 0, b: 1 },
    { a: -1, b: 0 },
    { a: -99, b: -2 },
    { a: 200000, b: Infinity },
  ];

  lesserTestCases.forEach(({ a, b }) => {
    it(`should return "true" when ${a} is lesser than ${b}`, () => {
      expect(isLessThan(a, b)).toBe(true);
    });
  });

  const equalTestCases = [
    { a: 0, b: 0 },
    { a: 1, b: 1 },
    { a: -1, b: -1 },
    { a: Infinity, b: Infinity },
  ];

  equalTestCases.forEach(({ a, b }) => {
    it(`should return "false" when ${a} and ${b} are equal`, () => {

      expect(isLessThan(a, b)).toBe(false);
    });
  });

  const nilTestCases = [
    { a: null, b: 2 },
    { a: undefined, b: 4 },
  ];

  nilTestCases.forEach(({ a, b }) => {
    it(`should return "false" when the input is ${a}`, () => {
      expect(isLessThan(a, b)).toBe(false);
    });
  });
});

describe('[includesValue] function', () => {
  const includesTestCases = [
    { input: [1, 2, 3], value: 1 },
    { input: [0, 2, 3], value: 0 },
    { input: ['1', '2', '3'], value: '3' },
  ];

  includesTestCases.forEach(({ input, value }) => {
    it(`should return "true" when an array [${input}] includes ${value}`, () => {
      expect(includesValue(input, value)).toBe(true);
    });
  });

  const doesNotIncludeTestCases = [
    { input: [1, 2, 3], value: 10 },
    { input: [0, 2, 3], value: -3 },
    { input: ['1', '2', '3'], value: '99' },
  ];

  doesNotIncludeTestCases.forEach(({ input, value }) => {
    it(`should return "false" when an array [${input}] does not include ${value}`, () => {
      expect(includesValue(input, value)).toBe(false);
    });
  });

  const nilTestCases = [
    { input: null, b: 2 },
    { input: undefined, b: 4 },
  ];

  nilTestCases.forEach(({ input, b }) => {
    it(`should return "false" when an array is ${input}`, () => {
      expect(includesValue(input, b)).toBe(false);
    });
  });
});

describe('[doesNotIncludeValue] function', () => {
  const includesTestCases = [
    { input: [1, 2, 3], value: 1 },
    { input: [0, 2, 3], value: 0 },
    { input: ['1', '2', '3'], value: '3' },
  ];

  includesTestCases.forEach(({ input, value }) => {
    it(`should return "false" when an array [${input}] includes ${value}`, () => {
      expect(doesNotIncludeValue(input, value)).toBe(false);
    });
  });

  const doesNotIncludeTestCases = [
    { input: [1, 2, 3], value: 10 },
    { input: [0, 2, 3], value: -3 },
    { input: ['1', '2', '3'], value: '99' },
  ];

  doesNotIncludeTestCases.forEach(({ input, value }) => {
    it(`should return "true" when an array [${input}] does not include ${value}`, () => {
      expect(doesNotIncludeValue(input, value)).toBe(true);
    });
  });

  const nilTestCases = [
    { input: null, b: 2 },
    { input: undefined, b: 4 },
  ];

  nilTestCases.forEach(({ input, b }) => {
    it(`should return "false" when an array is ${input}`, () => {
      expect(doesNotIncludeValue(input, b)).toBe(false);
    });
  });
});
