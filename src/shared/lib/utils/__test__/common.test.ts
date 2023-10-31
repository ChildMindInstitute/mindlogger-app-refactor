import { isEmptyObject, range } from '../common';

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
