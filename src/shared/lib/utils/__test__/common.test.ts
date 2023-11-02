import {
  callWithMutex,
  callWithMutexAsync,
  getStringHashCode,
  isEmptyObject,
  Mutex,
  range,
} from '../common';

const asyncFn = async (): Promise<any> => {
  return new Promise(resolve => setTimeout(resolve, 1000));
};

describe('Function range', () => {
  it('should return correct array', () => {
    const length = 5;

    const result = range(length);

    expect(result.length).toBe(length);
    expect(result[length - 1]).toBe(length - 1);
  });
});

describe('Function isEmptyObject', () => {
  it('should check if empty object is empty', () => {
    const obj = {};

    const result = isEmptyObject(obj);

    expect(result).toBe(false);
  });

  it('should check if not empty object has fields', () => {
    const obj = {
      foo: 'bar',
    };

    const result = isEmptyObject(obj);

    expect(result).toBe(true);
  });
});

describe('Function callWithMutexAsync', () => {
  it('should reflect correct mutex state when async func is pending', async () => {
    const mutex = Mutex();

    expect(mutex.isBusy()).toBe(false);

    callWithMutexAsync(mutex, asyncFn).finally(() => {
      expect(mutex.isBusy()).toBe(false);
    });
    expect(mutex.isBusy()).toBe(true);
  });
});

describe('Function callWithMutex', () => {
  it('should block callback when mutex state is busy', async () => {
    const mutex = Mutex();

    const fn = jest.fn();

    expect(mutex.isBusy()).toBe(false);

    mutex.setBusy();

    callWithMutex(mutex, fn);

    expect(fn).toBeCalledTimes(0);
  });

  it('should invoke callback when mutex state is not busy', () => {
    const mutex = Mutex();

    const fn = jest.fn();

    expect(mutex.isBusy()).toBe(false);

    callWithMutex(mutex, fn);

    expect(fn).toBeCalledTimes(1);
  });
});

describe('Function getStringHashCode', () => {
  it('should return correct hash', () => {
    const fakeResult = 69609650;
    const str = 'Hello';

    const result = getStringHashCode(str);

    expect(result).toBe(fakeResult);
  });
});
