import { LEGACY_PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';

import { LoginFormSchema } from '../LoginFormSchema';

function parseLogin(email: string, password: string) {
  return LoginFormSchema.safeParse({ email, password });
}

describe('LoginFormSchema', () => {
  const validEmail = 'user@example.com';

  it('accepts a valid email and password', () => {
    const result = parseLogin(validEmail, 'abcdef');
    expect(result.success).toBe(true);
  });

  it('rejects an empty password', () => {
    const result = parseLogin(validEmail, '');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(i => i.message === 'form_item:required'),
      ).toBe(true);
    }
  });

  it('rejects passwords containing spaces', () => {
    const result = parseLogin(validEmail, 'abc def');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          i => i.message === 'password_requirements:no_blank_spaces',
        ),
      ).toBe(true);
    }
  });

  it('does NOT enforce character type requirements (legacy compat)', () => {
    // All lowercase, no digits/symbols — should still pass for login
    const result = parseLogin(validEmail, 'abcdefgh');
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = parseLogin('not-an-email', 'abcdef');
    expect(result.success).toBe(false);
  });
});
