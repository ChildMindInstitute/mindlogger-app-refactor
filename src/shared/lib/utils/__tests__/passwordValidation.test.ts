import {
  PasswordErrorKey,
  hasDigit,
  hasLowercase,
  hasSymbol,
  hasUppercase,
  multiplePasswordChecks,
  noBlankSpaces,
} from '../passwordValidation';

const fourChecks = [hasUppercase, hasLowercase, hasDigit, hasSymbol] as const;

describe('passwordValidation', () => {
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
  });

  describe('noBlankSpaces', () => {
    it('fails when the password contains whitespace', () => {
      expect(noBlankSpaces('ab c').isValid).toBe(false);
      expect(noBlankSpaces('ab\tc').isValid).toBe(false);
    });

    it('passes when there is no whitespace', () => {
      expect(noBlankSpaces('abc').isValid).toBe(true);
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
