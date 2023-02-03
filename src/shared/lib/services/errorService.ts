export function throwError(errorMessage: string) {
  if (__DEV__) {
    console.error(errorMessage);
  } else {
    throw Error(errorMessage);
  }
}
