type ZodCheck = {
  isValid: boolean;
  message: PasswordErrorKey;
};

export enum PasswordErrorKey {
  MIN_LENGTH = 'password_requirements:at_least_characters',
  NO_BLANK_SPACES = 'password_requirements:no_blank_spaces',
  MUST_INCLUDE_UPPERCASE = 'password_requirements:must_include_uppercase',
  MUST_INCLUDE_LOWERCASE = 'password_requirements:must_include_lowercase',
  MUST_INCLUDE_DIGITS = 'password_requirements:must_include_digits',
  MUST_INCLUDE_SYMBOL = 'password_requirements:must_include_symbol',
  TYPES_MET = 'password_requirements:types_met',
  MUST_INCLUDE = 'must_include',
}

type PasswordCheckFn = (password: string) => ZodCheck;

export const hasUppercase: PasswordCheckFn = password => {
  return {
    isValid: /\p{Lu}/u.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
  };
};

export const hasLowercase: PasswordCheckFn = password => {
  return {
    isValid: /\p{Ll}/u.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
  };
};

export const hasDigit: PasswordCheckFn = password => {
  return {
    isValid: /\p{Nd}/u.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_DIGITS,
  };
};

export const hasSymbol: PasswordCheckFn = password => {
  return {
    isValid: /[^\p{L}\p{Nd}]/u.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
  };
};

export const noBlankSpaces: PasswordCheckFn = password => {
  return {
    isValid: !/\s/.test(password),
    message: PasswordErrorKey.NO_BLANK_SPACES,
  };
};

/**
 * Returns an array of error messages for the given password and list of checks
 *
 * @param password - The password to check
 * @param checks - The list of checks to perform (e.g. [hasUppercase, hasLowercase, hasDigit, hasSymbol])
 * @returns An array of error messages
 */
export const multiplePasswordChecks = (
  password: string,
  checks: PasswordCheckFn[],
): string[] => {
  const results = checks.map(fn => fn(password));
  console.log('results', results);
  return results
    .filter(result => !result.isValid)
    .map(result => result.message);
};
