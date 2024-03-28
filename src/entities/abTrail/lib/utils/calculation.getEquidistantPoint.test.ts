import { getEquidistantPoint, SkAlternatePath } from './calculation';

describe('getUploadRecord function1', () => {
  const negativeTests = [
    {
      points: [],
      expectedResult: null,
    },
    {
      points: [{ x: 0, y: 0 }],
      expectedResult: null,
    },
    {
      points: [
        { x: 0, y: 0 },
        { x: 100, y: 100 },
      ],
      expectedResult: null,
    },
  ];

  negativeTests.forEach(({ points, expectedResult }) => {
    it(`Should return ${expectedResult} when number of points is ${points.length}`, () => {
      const result = getEquidistantPoint(new SkAlternatePath(points));

      expect(result).toEqual(expectedResult);
    });
  });

  const positiveTests = [
    {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 100, y: 100 },
      ],
      expectedResult: { x: 10, y: 10 },
    },
    {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 60, y: 60 },
        { x: 100, y: 100 },
      ],
      expectedResult: { x: 60, y: 60 },
    },
    {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 100, y: 100 },
      ],
      expectedResult: { x: 30, y: 30 },
    },
    {
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 80, y: 80 },
        { x: 100, y: 100 },
      ],
      expectedResult: { x: 30, y: 30 },
    },
    {
      points: [
        { x: 0, y: 5 },
        { x: 10, y: 15 },
        { x: 20, y: 10 },
        { x: 30, y: 5 },
        { x: 60, y: 10 },
        { x: 80, y: 10 },
        { x: 100, y: 15 },
      ],
      expectedResult: { x: 60, y: 10 },
    },
    {
      points: [
        { x: 0, y: 5 },
        { x: 0, y: 15 },
        { x: 0, y: 10 },
        { x: 0, y: 5 },
        { x: 0, y: 10 },
        { x: 0, y: 10 },
        { x: 0, y: 15 },
      ],
      expectedResult: { x: 0, y: 10 },
    },
  ];

  positiveTests.forEach(({ points, expectedResult }) => {
    it(`Should return ${JSON.stringify(
      expectedResult,
    )} when number of points is ${points.length}`, () => {
      const result = getEquidistantPoint(new SkAlternatePath(points));

      expect(result).toEqual(expectedResult);
    });
  });
});
