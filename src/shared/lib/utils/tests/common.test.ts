import {
  callWithMutex,
  callWithMutexAsync,
  chunkArray,
  getStringHashCode,
  isObjectNotEmpty,
  Mutex,
  range,
  wait,
} from '../common';

describe('Test function range', () => {
  it('Should return [0,1,2,3,4] when length is 5', () => {
    const length = 5;

    const result = range(length);

    expect(result.length).toBe(length);
    expect(result).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('Test function isPropertyInObject', () => {
  it('should return false when an empty object provided', () => {
    const obj = {};

    const result = isObjectNotEmpty(obj);

    expect(result).toBe(false);
  });

  it('should return true when an object contains property', () => {
    const obj = {
      foo: 'bar',
    };

    const result = isObjectNotEmpty(obj);

    expect(result).toBe(true);
  });
});

describe('Test functions: callWithMutexAsync, callWithMutex', () => {
  it('Should reflect correct mutex state before, during and after function execution', async () => {
    const mutex = Mutex();

    expect(mutex.isBusy()).toBe(false);

    const promise = callWithMutexAsync(mutex, async () => await wait(100));

    expect(mutex.isBusy()).toBe(true);

    await promise;

    expect(mutex.isBusy()).toBe(false);
  });

  it('Should block callback when mutex state is busy', async () => {
    const mutex = Mutex();

    const fn = jest.fn();

    expect(mutex.isBusy()).toBe(false);

    mutex.setBusy();

    callWithMutex(mutex, fn);

    expect(fn).toBeCalledTimes(0);
  });

  it('Should invoke callback when mutex state is not busy', () => {
    const mutex = Mutex();

    const fn = jest.fn();

    expect(mutex.isBusy()).toBe(false);

    callWithMutex(mutex, fn);

    expect(mutex.isBusy()).toBe(false);
    expect(fn).toBeCalledTimes(1);
  });
});

describe('Test function getStringHashCode', () => {
  it('Should return expected hash for string "Hello"', () => {
    const expectedResult = 69609650;
    const str = 'Hello';

    const result = getStringHashCode(str);

    expect(result).toBe(expectedResult);
  });
});

describe('Test function chunkArray', () => {
  const testCases = [
    {
      input: {
        array: [],
        chunks: 5,
      },
      expected: [],
    },
    {
      input: {
        array: [1, 2, 3],
        chunks: 3,
      },
      expected: [[1, 2, 3]],
    },
    {
      input: {
        array: [1, 2, 3],
        chunks: 1,
      },
      expected: [[1], [2], [3]],
    },
    {
      input: {
        array: [1, 2, 3, 4, 5, 6],
        chunks: 2,
      },
      expected: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    },
    {
      input: {
        array: [1, 2, 3, 4, 5, 6, 7],
        chunks: 2,
      },
      expected: [[1, 2], [3, 4], [5, 6], [7]],
    },
  ];

  const stringify = (array: number[] | Array<number[]>) =>
    JSON.stringify(array);

  testCases.forEach(testCase => {
    const expectedResult = stringify(testCase.expected);

    it(`should return ${expectedResult} when an array is ${stringify(testCase.input.array)} and chunks is ${testCase.input.chunks}`, () => {
      const result = chunkArray(testCase.input.array, testCase.input.chunks);

      expect(stringify(result)).toBe(expectedResult);
    });
  });
});
