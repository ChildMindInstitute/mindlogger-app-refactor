import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import { PasswordErrorKey } from '@app/shared/lib/utils/passwordValidation';

import { SignUpFormSchema } from '../SignUpFormSchema';

const validBase = {
  email: 'user@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
} as const;

function parsePassword(password: string) {
  return SignUpFormSchema.safeParse({
    ...validBase,
    password,
  });
}

describe('SignUpFormSchema — password', () => {
  it('accepts passwords that meet minimum length and at least three of four character types', () => {
    const validPasswords = [
      'Abcdefgh12', // upper, lower, digit (10 chars)
      'abcdefghij1!', // lower, digit, symbol
      'ABCDEFGH1!', // upper, digit, symbol
      'Abcdefghijk!', // upper, lower, symbol (no digit — still 3 types)
    ];

    validPasswords.forEach(pw => {
      const result = parsePassword(pw);
      expect(result.success).toBe(true);
    });
  });

  it('rejects an empty password with the required message', () => {
    const result = parsePassword('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(i => i.message === 'form_item:required'),
      ).toBe(true);
    }
  });

  it('rejects passwords shorter than the minimum length', () => {
    const result = parsePassword('Ab1!'); // 4 chars, multiple types
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i => i.message === PasswordErrorKey.MIN_LENGTH,
        ),
      ).toBe(true);
    }
  });

  it('rejects passwords that do not meet at least three character types', () => {
    // Exactly 10 chars but only upper + digit (two types)
    const result = parsePassword('ABCDEFGH12');
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages).toContain(PasswordErrorKey.MUST_INCLUDE_MINIMUM);
      expect(messages).toContain(PasswordErrorKey.MUST_INCLUDE_LOWERCASE);
      expect(messages).toContain(PasswordErrorKey.MUST_INCLUDE_SYMBOL);
    }
  });

  it('rejects passwords that contain whitespace', () => {
    const result = parsePassword('Abcdefgh1! ');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i => i.message === PasswordErrorKey.NO_BLANK_SPACES,
        ),
      ).toBe(true);
    }
  });

  it('accepts equivalent Unicode spellings after NFC normalization', () => {
    // NFD vs NFC for "À" at the start; 10 chars after normalization
    const nfd = '\u0041\u0300bcdefgh1!';
    const nfc = '\u00C0bcdefgh1!';
    const nfdResult = parsePassword(nfd);
    const nfcResult = parsePassword(nfc);
    expect(nfdResult.success).toBe(true);
    expect(nfcResult.success).toBe(true);
    if (nfdResult.success && nfcResult.success) {
      expect(nfdResult.data.password.normalize('NFKC')).toBe(
        nfcResult.data.password.normalize('NFKC'),
      );
    }
  });
});

describe('SignUpFormSchema — full form', () => {
  it('accepts a complete valid payload', () => {
    const result = SignUpFormSchema.safeParse({
      email: 'new@example.com',
      password: 'ValidPass1!',
      firstName: 'Test',
      lastName: 'User',
    });
    expect(result.success).toBe(true);
  });

  it('requires a syntactically plausible email', () => {
    const result = SignUpFormSchema.safeParse({
      email: 'not-an-email',
      password: `${'a'.repeat(PASSWORD_MIN_LENGTH)}1!`,
      firstName: 'Test',
      lastName: 'User',
    });
    expect(result.success).toBe(false);
  });
});
