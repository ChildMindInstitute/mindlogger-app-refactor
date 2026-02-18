import { filterDigitsOnly, formatRecoveryCode } from '../inputFilters';

describe('inputFilters', () => {
  describe('filterDigitsOnly', () => {
    it('should remove all non-digit characters', () => {
      expect(filterDigitsOnly('abc123xyz')).toBe('123');
      expect(filterDigitsOnly('12.34')).toBe('1234');
      expect(filterDigitsOnly('1 2 3')).toBe('123');
    });

    it('should remove symbols', () => {
      expect(filterDigitsOnly('1!2@3#4$5%6')).toBe('123456');
      expect(filterDigitsOnly('$$100.00')).toBe('10000');
    });

    it('should handle empty string', () => {
      expect(filterDigitsOnly('')).toBe('');
    });

    it('should handle string with only non-digits', () => {
      expect(filterDigitsOnly('abcdef')).toBe('');
      expect(filterDigitsOnly('!@#$%^')).toBe('');
    });

    it('should handle string with only digits', () => {
      expect(filterDigitsOnly('123456')).toBe('123456');
    });

    it('should remove spaces', () => {
      expect(filterDigitsOnly('1 2 3 4 5 6')).toBe('123456');
      expect(filterDigitsOnly('  123  ')).toBe('123');
    });

    it('should handle pasted text with mixed characters', () => {
      expect(filterDigitsOnly('Code: 123456')).toBe('123456');
      expect(filterDigitsOnly('Verification-Code-123456')).toBe('123456');
    });
  });

  describe('formatRecoveryCode', () => {
    it('should convert to uppercase', () => {
      expect(formatRecoveryCode('abc12')).toBe('ABC12');
      expect(formatRecoveryCode('xyz99')).toBe('XYZ99');
    });

    it('should format with hyphen after 5 characters', () => {
      expect(formatRecoveryCode('abc12def34')).toBe('ABC12-DEF34');
      expect(formatRecoveryCode('ABCDE12345')).toBe('ABCDE-12345');
    });

    it('should remove symbols and spaces', () => {
      expect(formatRecoveryCode('a!b@c#1$2')).toBe('ABC12');
      expect(formatRecoveryCode('ABC 12 DEF 34')).toBe('ABC12-DEF34');
      expect(formatRecoveryCode('A!B@C#1$2%D^E&F*3(4)')).toBe('ABC12-DEF34');
    });

    it('should handle hyphen in input', () => {
      expect(formatRecoveryCode('ABC12-DEF34')).toBe('ABC12-DEF34');
      expect(formatRecoveryCode('AB-C12-DE-F34')).toBe('ABC12-DEF34');
    });

    it('should limit to 10 characters plus hyphen', () => {
      expect(formatRecoveryCode('ABCDEFGHIJKLMNOP')).toBe('ABCDE-FGHIJ');
      expect(formatRecoveryCode('12345678901234')).toBe('12345-67890');
    });

    it('should handle short input (< 5 characters)', () => {
      expect(formatRecoveryCode('AB')).toBe('AB');
      expect(formatRecoveryCode('ABC')).toBe('ABC');
      expect(formatRecoveryCode('ABCD')).toBe('ABCD');
    });

    it('should handle exactly 5 characters', () => {
      expect(formatRecoveryCode('ABCDE')).toBe('ABCDE');
    });

    it('should handle empty string', () => {
      expect(formatRecoveryCode('')).toBe('');
    });

    it('should handle string with only symbols', () => {
      expect(formatRecoveryCode('!@#$%^&*()')).toBe('');
    });

    it('should handle pasted recovery code with spaces', () => {
      expect(formatRecoveryCode('XYZAB 12345')).toBe('XYZAB-12345');
      expect(formatRecoveryCode(' A B C 1 2 D E F 3 4 ')).toBe('ABC12-DEF34');
    });
  });
});
