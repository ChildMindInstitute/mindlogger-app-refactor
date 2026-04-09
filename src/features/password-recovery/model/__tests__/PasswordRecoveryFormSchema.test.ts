import { PasswordErrorKey } from '@app/shared/lib/utils/passwordValidation';

import { PasswordRecoveryFormSchema } from '../PasswordRecoveryFormSchema';

function parseRecovery(newPassword: string, confirmPassword: string) {
  return PasswordRecoveryFormSchema.safeParse({ newPassword, confirmPassword });
}

describe('PasswordRecoveryFormSchema', () => {
  const strongPassword = 'Abcdefgh1!';

  it('accepts matching passwords that meet all requirements', () => {
    const result = parseRecovery(strongPassword, strongPassword);
    expect(result.success).toBe(true);
  });

  it('rejects passwords shorter than minimum length', () => {
    const result = parseRecovery('Ab1!', 'Ab1!');
    expect(result.success).toBe(false);
  });

  it('rejects passwords with fewer than 3 character types', () => {
    const result = parseRecovery('ABCDEFGH12', 'ABCDEFGH12');
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages).toContain(PasswordErrorKey.TYPES_MET);
    }
  });

  it('rejects passwords containing spaces', () => {
    const result = parseRecovery('Abcdefgh 1!', 'Abcdefgh 1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i => i.message === PasswordErrorKey.NO_BLANK_SPACES,
        ),
      ).toBe(true);
    }
  });

  it('rejects when passwords do not match', () => {
    const result = parseRecovery(strongPassword, 'DifferentPw1!');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i => i.message === 'password_recovery_form:passwords_do_not_match',
        ),
      ).toBe(true);
    }
  });

  it('rejects empty confirmPassword', () => {
    const result = parseRecovery(strongPassword, '');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i =>
            i.message ===
            'password_recovery_form:password_confirmation_required',
        ),
      ).toBe(true);
    }
  });

  it('does NOT apply character type validation on confirmPassword', () => {
    // If confirmPassword had char-type validation, this would produce
    // TYPES_MET errors on the confirmPassword path. It should only fail
    // on the match check.
    const result = parseRecovery(strongPassword, 'aaaaaa');
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmErrors = result.error.issues.filter(i =>
        i.path.includes('confirmPassword'),
      );
      const confirmMessages = confirmErrors.map(i => i.message);
      expect(confirmMessages).not.toContain(PasswordErrorKey.TYPES_MET);
      expect(confirmMessages).toContain(
        'password_recovery_form:passwords_do_not_match',
      );
    }
  });
});
