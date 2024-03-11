import {
  callWithMutex,
  callWithMutexAsync,
  getStringHashCode,
  isPropertyInObject,
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

    const result = isPropertyInObject(obj);

    expect(result).toBe(false);
  });

  it('should return true when an object contains property', () => {
    const obj = {
      foo: 'bar',
    };

    const result = isPropertyInObject(obj);

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
