import Graphemer from 'graphemer';
import { z } from 'zod';

import {
  PASSWORD_MIN_LENGTH,
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
} from '@app/shared/lib/constants/password';

import {
  UPPERCASE_REGEXP,
  LOWERCASE_REGEXP,
  DIGIT_REGEXP,
  SYMBOL_REGEXP,
  VISIBLE_ONLY_REGEXP,
  HIDDEN_BLANKS_REGEXP,
  CASELESS_LETTER_REGEXP,
  PasswordCheckResult,
} from './passwordPatterns';

/**
 * Normalize password input to NFKC (per RFC 8265 PRECIS OpaqueString profile)
 * so the same passphrase is not treated as different strings when composed
 * differently (e.g. precomposed é vs e + combining accent, or fullwidth vs ASCII).
 * Use the same normalization before hashing on the server.
 */
export const normalizePasswordUnicode = (password: string): string =>
  password.normalize('NFKC');

const graphemeLength = (str: string) => new Graphemer().countGraphemes(str);

// Unified password check — returns a full result object matching admin/web.
export const checkPassword = (
  password: string,
  minLength: number = PASSWORD_MIN_LENGTH,
): PasswordCheckResult => {
  const normalized = normalizePasswordUnicode(password);

  const hasCaselessLetter = CASELESS_LETTER_REGEXP.test(normalized);
  const uppercaseResult =
    UPPERCASE_REGEXP.test(normalized) || hasCaselessLetter;
  const lowercaseResult =
    LOWERCASE_REGEXP.test(normalized) || hasCaselessLetter;
  const digitResult = DIGIT_REGEXP.test(normalized);
  const symbolResult = SYMBOL_REGEXP.test(normalized);
  const charTypeCount = [
    uppercaseResult,
    lowercaseResult,
    digitResult,
    symbolResult,
  ].filter(Boolean).length;

  return {
    hasUppercase: uppercaseResult,
    hasLowercase: lowercaseResult,
    hasCaselessLetter,
    hasDigit: digitResult,
    hasSymbol: symbolResult,
    hasNoSpaces:
      VISIBLE_ONLY_REGEXP.test(normalized) &&
      !HIDDEN_BLANKS_REGEXP.test(normalized),
    meetsLength: graphemeLength(normalized) >= minLength,
    charTypeCount,
    meetsCharTypeRequirement: charTypeCount >= ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  };
};

export type { PasswordCheckResult } from './passwordPatterns';

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
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid:
      UPPERCASE_REGEXP.test(normalized) ||
      CASELESS_LETTER_REGEXP.test(normalized),
    message: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
  };
};

export const hasLowercase: PasswordCheckFn = password => {
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid:
      LOWERCASE_REGEXP.test(normalized) ||
      CASELESS_LETTER_REGEXP.test(normalized),
    message: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
  };
};

export const hasDigit: PasswordCheckFn = password => {
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid: DIGIT_REGEXP.test(normalized),
    message: PasswordErrorKey.MUST_INCLUDE_DIGITS,
  };
};

export const hasSymbol: PasswordCheckFn = password => {
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid: SYMBOL_REGEXP.test(normalized),
    message: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
  };
};

export const noBlankSpaces: PasswordCheckFn = password => {
  const normalized = normalizePasswordUnicode(password);
  return {
    isValid:
      VISIBLE_ONLY_REGEXP.test(normalized) &&
      !HIDDEN_BLANKS_REGEXP.test(normalized),
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
export const passwordSuperRefine = (
  minRequiredChecks = 3,
): ((value: string, ctx: z.RefinementCtx) => void) => {
  return (value, ctx) => {
    const { errors, isValid } = multiplePasswordChecks(
      value,
      defaultPasswordTypeChecks,
      minRequiredChecks,
    );

    if (value.length < PASSWORD_MIN_LENGTH) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.MIN_LENGTH,
      });
    }

    if (!noBlankSpaces(value).isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.NO_BLANK_SPACES,
      });
    }

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
