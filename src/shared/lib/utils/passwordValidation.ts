import { z } from 'zod';

/**
 * Normalize password input to NFC so the same passphrase is not treated as
 * different strings when composed differently (e.g. precomposed é vs e + combining accent).
 * Use the same normalization before hashing on the server.
 */
export const normalizePasswordUnicode = (password: string): string =>
  password.normalize('NFC');

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
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid: !/\s/.test(normalized),
    message: PasswordErrorKey.NO_BLANK_SPACES,
  };
};

/**
 * Returns an array of error messages for the given password and list of checks
 *
 * @param password - The password to check
 * @param checks - The list of checks to perform (e.g. [hasUppercase, hasLowercase, hasDigit, hasSymbol])
 * @param minRequiredChecks - The minimum number of checks that must pass for the password to be valid
 * @returns An object containing an array of error messages and a boolean indicating whether the password is valid
 */
export const multiplePasswordChecks = (
  password: string,
  checks: PasswordCheckFn[],
  minRequiredChecks: number = 3,
): { errors: string[]; isValid: boolean } => {
  const normalized = normalizePasswordUnicode(password);
  const results = checks.map(fn => fn(normalized));
  const errors = results
    .filter(result => !result.isValid)
    .map(result => result.message);

  const passed = results.filter(result => result.isValid).length;
  return {
    errors,
    isValid: passed >= minRequiredChecks,
  };
};

const defaultPasswordTypeChecks: PasswordCheckFn[] = [
  hasUppercase,
  hasLowercase,
  hasDigit,
  hasSymbol,
];

/**
 * Zod superRefine: at least `minRequiredChecks` of uppercase, lowercase, digit, symbol (default 3 of 4).
 *
 * @param minRequiredChecks - The minimum number of checks that must pass for the password to be valid (default 3)
 *
 * @returns A function that can be used as a superRefine for a Zod schema
 */
export const passwordCharacterTypesSuperRefine = (
  minRequiredChecks = 3,
): ((value: string, ctx: z.RefinementCtx) => void) => {
  return (value, ctx) => {
    const { errors, isValid } = multiplePasswordChecks(
      value,
      defaultPasswordTypeChecks,
      minRequiredChecks,
    );

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.TYPES_MET,
      });

      errors.forEach(error => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error,
        });
      });
    }
  };
};
