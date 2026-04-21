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

/** Check if the password meets the account password policy. */
export const isAccountPasswordPolicySatisfied = (
  password: string,
  minLength: number = PASSWORD_MIN_LENGTH,
): boolean => {
  const result = checkPassword(password, minLength);
  return (
    result.meetsLength && result.hasNoSpaces && result.meetsCharTypeRequirement
  );
};

export type { PasswordCheckResult } from './passwordPatterns';

type ZodCheck = {
  isValid: boolean;
  message: PasswordErrorKey;
};

export enum PasswordErrorKey {
  MIN_LENGTH = 'password_requirements:at_least_characters',
  MUST_INCLUDE_MINIMUM = 'password_requirements:must_include_minimum',
  NO_BLANK_SPACES = 'password_requirements:no_blank_spaces',
  MUST_INCLUDE_UPPERCASE = 'password_requirements:must_include_uppercase',
  MUST_INCLUDE_LOWERCASE = 'password_requirements:must_include_lowercase',
  MUST_INCLUDE_DIGITS = 'password_requirements:must_include_digits',
  MUST_INCLUDE_SYMBOL = 'password_requirements:must_include_symbol',
}

type PasswordCheckFn = (password: string) => ZodCheck;

export const hasUppercase: PasswordCheckFn = password => {
  return {
    isValid:
      UPPERCASE_REGEXP.test(password) || CASELESS_LETTER_REGEXP.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
  };
};

export const hasLowercase: PasswordCheckFn = password => {
  return {
    isValid:
      LOWERCASE_REGEXP.test(password) || CASELESS_LETTER_REGEXP.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
  };
};

export const hasDigit: PasswordCheckFn = password => {
  return {
    isValid: DIGIT_REGEXP.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_DIGITS,
  };
};

export const hasSymbol: PasswordCheckFn = password => {
  return {
    isValid: SYMBOL_REGEXP.test(password),
    message: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
  };
};

export const noBlankSpaces: PasswordCheckFn = password => {
  return {
    isValid:
      VISIBLE_ONLY_REGEXP.test(password) &&
      !HIDDEN_BLANKS_REGEXP.test(password),
    message: PasswordErrorKey.NO_BLANK_SPACES,
  };
};

/**
 * Zod superRefine: at least `minRequiredChecks` of uppercase, lowercase, digit, symbol (default 3 of 4).
 *
 * @param minRequiredChecks - The minimum number of checks that must pass for the password to be valid (default 3)
 *
 * @returns A function that can be used as a superRefine for a Zod schema
 */
export const passwordSuperRefine = (): ((
  value: string,
  ctx: z.RefinementCtx,
) => void) => {
  return (value, ctx) => {
    const normalized = normalizePasswordUnicode(value);
    const result = checkPassword(normalized);

    if (!result.meetsCharTypeRequirement) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.MUST_INCLUDE_MINIMUM,
      });
    }

    if (!result.meetsLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.MIN_LENGTH,
      });
    }

    if (!result.hasNoSpaces) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: PasswordErrorKey.NO_BLANK_SPACES,
      });
    }

    const isValid =
      result.meetsCharTypeRequirement &&
      result.meetsLength &&
      result.hasNoSpaces;

    if (isValid) {
      return;
    } else {
      if (!result.hasUppercase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PasswordErrorKey.MUST_INCLUDE_UPPERCASE,
        });
      }
      if (!result.hasLowercase) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PasswordErrorKey.MUST_INCLUDE_LOWERCASE,
        });
      }
      if (!result.hasDigit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PasswordErrorKey.MUST_INCLUDE_DIGITS,
        });
      }
      if (!result.hasSymbol) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PasswordErrorKey.MUST_INCLUDE_SYMBOL,
        });
      }
    }
  };
};
