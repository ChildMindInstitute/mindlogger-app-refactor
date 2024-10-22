import { DrawLine, DrawPoint } from '../lib/types/draw';
import {
  getChunkedPointsAsStrings,
  getElementsDimensions,
} from '../lib/utils/helpers';

describe('Test getElementsDimensions function', () => {
  const testCases = [
    {
      dimensions: {
        width: 300,
        height: 800,
      },
      exampleImageDimensions: {
        width: 300,
        height: 300,
        aspectRatio: 1,
      },
    },
    {
      dimensions: {
        width: 800,
        height: 800,
      },
      exampleImageDimensions: {
        width: 800,
        height: 300,
        aspectRatio: 2.666667,
      },
    },
    {
      dimensions: {
        width: 300,
        height: 800,
      },
      exampleImageDimensions: {
        width: 300,
        height: 800,
        aspectRatio: 0.375,
      },
    },
    {
      dimensions: {
        width: 300,
        height: 800,
      },
      exampleImageDimensions: {
        width: 200,
        height: 100,
        aspectRatio: 2,
      },
    },
    {
      dimensions: {
        width: 300,
        height: 800,
      },
      exampleImageDimensions: null,
    },
    {
      dimensions: {
        width: 800,
        height: 800,
      },
      exampleImageDimensions: null,
    },
  ];

  const expectedResults = [
    {
      exampleImageHeight: 300,
      canvasContainerHeight: 476,
      canvasSize: 270,
    },
    {
      exampleImageHeight: 299,
      canvasContainerHeight: 476,
      canvasSize: 476,
    },
    {
      exampleImageHeight: 304,
      canvasContainerHeight: 476,
      canvasSize: 270,
    },
    {
      exampleImageHeight: 150,
      canvasContainerHeight: 476,
      canvasSize: 270,
    },
    {
      exampleImageHeight: 0,
      canvasContainerHeight: 780,
      canvasSize: 270,
    },
    {
      exampleImageHeight: 0,
      canvasContainerHeight: 780,
      canvasSize: 770,
    },
  ];

  testCases.forEach((testCase, i) => {
    const expectedResult = expectedResults[i];

    it(`should return exampleImageHeight: ${
      expectedResult.exampleImageHeight
    }, canvasContainerHeight: ${
      expectedResult.canvasContainerHeight
    }, canvasSize: ${expectedResult.canvasSize} when height is ${
      testCase.dimensions.height
    }, width is ${testCase.dimensions.width} and the example image is ${
      testCase.exampleImageDimensions ? '' : 'NOT'
    } present`, () => {
      expect(
        getElementsDimensions(
          testCase.dimensions,
          testCase.exampleImageDimensions,
        ),
      ).toMatchObject(expectedResult);
    });
  });
});

describe('Test getChunkedPointsAsStrings function', () => {
  it('should return an empty array when lines array is empty', () => {
    const lines: DrawLine[] = [];

    expect(getChunkedPointsAsStrings(lines)).toEqual([]);
  });

  it('should correctly chunk points into strings', () => {
    const points: DrawPoint[] = [
      { x: 1, y: 1, time: 0 },
      { x: 2, y: 2, time: 1 },
      { x: 3, y: 3, time: 2 },
      { x: 4, y: 4, time: 3 },
      { x: 5, y: 5, time: 4 },
    ];

    const lines: DrawLine[] = [{ points, startTime: 0 }];

    const expected = ['1,1 2,2 3,3 4,4 5,5'];

    expect(getChunkedPointsAsStrings(lines)).toEqual(expected);
  });

  it('should correctly chunk points into strings with two lines', () => {
    const points1: DrawPoint[] = [
      { x: 1, y: 1, time: 0 },
      { x: 2, y: 2, time: 1 },
      { x: 3, y: 3, time: 2 },
    ];

    const points2: DrawPoint[] = [
      { x: 4, y: 4, time: 3 },
      { x: 5, y: 5, time: 4 },
      { x: 6, y: 6, time: 5 },
    ];

    const lines: DrawLine[] = [
      { points: points1, startTime: 0 },
      { points: points2, startTime: 6 },
    ];

    const expected = ['1,1 2,2 3,3', '4,4 5,5 6,6'];

    expect(getChunkedPointsAsStrings(lines)).toEqual(expected);
  });

  it('should correctly chunk points into strings with three lines', () => {
    const points1: DrawPoint[] = [
      { x: 1, y: 1, time: 0 },
      { x: 2, y: 2, time: 1 },
    ];

    const points2: DrawPoint[] = [
      { x: 3, y: 3, time: 2 },
      { x: 4, y: 4, time: 3 },
    ];

    const points3: DrawPoint[] = [
      { x: 5, y: 5, time: 4 },
      { x: 6, y: 6, time: 5 },
    ];

    const lines: DrawLine[] = [
      { points: points1, startTime: 0 },
      { points: points2, startTime: 2 },
      { points: points3, startTime: 4 },
    ];

    const expected = ['1,1 2,2', '3,3 4,4', '5,5 6,6'];

    expect(getChunkedPointsAsStrings(lines)).toEqual(expected);
  });
});
