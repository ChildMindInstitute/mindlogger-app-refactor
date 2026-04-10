export const UPPERCASE_REGEXP = /\p{Lu}/u;
export const LOWERCASE_REGEXP = /\p{Ll}/u;
export const DIGIT_REGEXP = /\p{Nd}/u;
export const SYMBOL_REGEXP = /[^\p{L}\p{Nd}\s]/u;
// Allows only visible characters (letters, digits, punctuation, symbols, marks)
export const VISIBLE_ONLY_REGEXP = /^[\p{L}\p{Nd}\p{P}\p{S}\p{M}]+$/u;
// Blank-looking characters that Unicode classifies as visible
export const HIDDEN_BLANKS_REGEXP = /[\u2800\u3164\u115F\u1160\uFFA0]/u;
// Letters with no upper/lower distinction (CJK, Arabic, Hebrew, Korean, etc.)
export const CASELESS_LETTER_REGEXP = /[\p{Lo}\p{Lm}]/u;

export type PasswordCheckResult = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasCaselessLetter: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  hasNoSpaces: boolean;
  meetsLength: boolean;
  charTypeCount: number;
  meetsCharTypeRequirement: boolean;
};
