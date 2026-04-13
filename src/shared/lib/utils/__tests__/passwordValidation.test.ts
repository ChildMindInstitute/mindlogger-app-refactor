import {
  PasswordErrorKey,
  checkPassword,
  hasDigit,
  hasLowercase,
  hasSymbol,
  hasUppercase,
  multiplePasswordChecks,
  noBlankSpaces,
  normalizePasswordUnicode,
} from '../passwordValidation';

const fourChecks = [hasUppercase, hasLowercase, hasDigit, hasSymbol] as const;

describe('passwordValidation', () => {
  describe('normalizePasswordUnicode', () => {
    it('normalizes to NFKC', () => {
      expect(normalizePasswordUnicode('e\u0301')).toBe('é');
      expect(normalizePasswordUnicode('A\u0300bcdefgh1!')).toBe('Àbcdefgh1!');
    });
  });

  describe('hasUppercase / hasLowercase / hasDigit / hasSymbol', () => {
    it('detects each character class in isolation', () => {
      expect(hasUppercase('A').isValid).toBe(true);
      expect(hasUppercase('a').isValid).toBe(false);

      expect(hasLowercase('a').isValid).toBe(true);
      expect(hasLowercase('A').isValid).toBe(false);

      expect(hasDigit('1').isValid).toBe(true);
      expect(hasDigit('a').isValid).toBe(false);

      expect(hasSymbol('!').isValid).toBe(true);
      expect(hasSymbol('a').isValid).toBe(false);
    });

    it('treats caseless scripts (CJK, Arabic, Hebrew) as both uppercase and lowercase', () => {
      // CJK character
      expect(hasUppercase('密').isValid).toBe(true);
      expect(hasLowercase('密').isValid).toBe(true);

      // Arabic character
      expect(hasUppercase('ع').isValid).toBe(true);
      expect(hasLowercase('ع').isValid).toBe(true);

      // Hebrew character
      expect(hasUppercase('א').isValid).toBe(true);
      expect(hasLowercase('א').isValid).toBe(true);
    });

    it('does not count a space as a symbol', () => {
      expect(hasSymbol(' ').isValid).toBe(false);
      expect(hasSymbol('\t').isValid).toBe(false);
    });
  });

  describe('noBlankSpaces', () => {
    it('fails when the password contains whitespace', () => {
      expect(noBlankSpaces('ab c').isValid).toBe(false);
      expect(noBlankSpaces('ab\tc').isValid).toBe(false);
    });

    it('passes when there is no whitespace', () => {
      expect(noBlankSpaces('abc').isValid).toBe(true);
    });

    it('rejects hidden Unicode blanks (zero-width, Braille blank, etc.)', () => {
      expect(noBlankSpaces('abc\u2800def').isValid).toBe(false); // Braille blank
      expect(noBlankSpaces('abc\u3164def').isValid).toBe(false); // Hangul filler
      expect(noBlankSpaces('abc\uFFA0def').isValid).toBe(false); // Half-width Hangul filler
    });
  });

  describe('checkPassword (unified)', () => {
    it('returns all fields for a fully compliant password', () => {
      const result = checkPassword('Abcdefgh1!');
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.hasDigit).toBe(true);
      expect(result.hasSymbol).toBe(true);
      expect(result.hasNoSpaces).toBe(true);
      expect(result.meetsLength).toBe(true);
      expect(result.charTypeCount).toBe(4);
      expect(result.meetsCharTypeRequirement).toBe(true);
    });

    it('reports meetsLength false when too short', () => {
      const result = checkPassword('Abc1!');
      expect(result.meetsLength).toBe(false);
    });

    it('supports custom minLength (legacy)', () => {
      const result = checkPassword('abc123', 6);
      expect(result.meetsLength).toBe(true);
    });

    it('handles caseless scripts in charTypeCount', () => {
      // CJK + digit = uppercase(caseless) + lowercase(caseless) + digit = 3 types
      const result = checkPassword('密码密码密码密码密码1');
      expect(result.hasCaselessLetter).toBe(true);
      expect(result.hasUppercase).toBe(true);
      expect(result.hasLowercase).toBe(true);
      expect(result.charTypeCount).toBeGreaterThanOrEqual(3);
      expect(result.meetsCharTypeRequirement).toBe(true);
    });

    it('counts emoji via spread length, not string.length', () => {
      // 10 emoji = 10 characters by spread, even if string.length > 10
      const tenEmoji = '😀😁😂🤣😃😄😅😆😉😊';
      const result = checkPassword(tenEmoji);
      expect(result.meetsLength).toBe(true);
    });
  });

  describe('multiplePasswordChecks', () => {
    it('marks valid when at least minRequiredChecks pass (default 3)', () => {
      const { isValid, errors } = multiplePasswordChecks(
        'Abcdefgh12',
        [...fourChecks],
        3,
      );
      expect(isValid).toBe(true);
      // Failed checks are still listed even when the minimum count is met
      expect(errors).toEqual([PasswordErrorKey.MUST_INCLUDE_SYMBOL]);
    });

    it('marks invalid and lists failed checks when fewer than required types pass', () => {
      const { isValid, errors } = multiplePasswordChecks(
        'ABCDEFGH12',
        [...fourChecks],
        3,
      );
      expect(isValid).toBe(false);
      expect(errors).toContain(PasswordErrorKey.MUST_INCLUDE_LOWERCASE);
      expect(errors).toContain(PasswordErrorKey.MUST_INCLUDE_SYMBOL);
    });

    it('respects a custom minRequiredChecks threshold', () => {
      expect(multiplePasswordChecks('ABC123', [...fourChecks], 2).isValid).toBe(
        true,
      );
      expect(multiplePasswordChecks('ABC123', [...fourChecks], 3).isValid).toBe(
        false,
      );
    });
  });
});
