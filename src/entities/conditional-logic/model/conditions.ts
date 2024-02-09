export const isBetweenValues = (input: Maybe<number>, min: number, max: number) => {
  if (input == null) {
    return false;
  }

  return input > min && input < max;
};

export const isOutsideOfValues = (input: Maybe<number>, min: number, max: number) => {
  if (input == null) {
    return false;
  }

  return input < min || input > max;
};

// and isEqualToOption
export const isEqualToValue = (input: unknown, valueToCompareWith: NonNullable<unknown>) => {
  if (input == null) {
    return false;
  }

  return input === valueToCompareWith;
};

export const isGreaterThan = (input: Maybe<number>, valueToCompareWith: number) => {
  if (input == null) {
    return false;
  }

  return input > valueToCompareWith;
};

export const isLessThan = (input: Maybe<number>, valueToCompareWith: number) => {
  if (input == null) {
    return false;
  }

  return input < valueToCompareWith;
};

export const includesValue = <TItem>(input: Maybe<TItem[]>, value: TItem) => {
  if (input == null) {
    return false;
  }

  return input.includes(value);
};

export const doesNotIncludeValue = <TItem>(input: Maybe<TItem[]>, value: TItem) => {
  if (input == null) {
    return false;
  }

  return !input.includes(value);
};
