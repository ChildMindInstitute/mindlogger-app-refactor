import { MfaVerificationFormSchema } from '../MfaVerificationFormSchema';

describe('MfaVerificationFormSchema', () => {
  it('should accept valid 6-digit codes', () => {
    const validCodes = ['123456', '000000', '999999', '111111'];

    validCodes.forEach(code => {
      const result = MfaVerificationFormSchema.safeParse({
        verificationCode: code,
      });
      expect(result.success).toBe(true);
    });
  });

  it('should reject codes with less than 6 digits', () => {
    const invalidCodes = ['', '1', '12', '123', '1234', '12345'];

    invalidCodes.forEach(code => {
      const result = MfaVerificationFormSchema.safeParse({
        verificationCode: code,
      });
      expect(result.success).toBe(false);
    });
  });

  it('should reject codes with more than 6 digits', () => {
    const invalidCodes = ['1234567', '12345678', '123456789'];

    invalidCodes.forEach(code => {
      const result = MfaVerificationFormSchema.safeParse({
        verificationCode: code,
      });
      expect(result.success).toBe(false);
    });
  });

  it('should reject non-numeric codes', () => {
    const invalidCodes = [
      'abcdef',
      'a12345',
      '12345a',
      '12a345',
      '!@#$%^',
      '123!45',
    ];

    invalidCodes.forEach(code => {
      const result = MfaVerificationFormSchema.safeParse({
        verificationCode: code,
      });
      expect(result.success).toBe(false);
    });
  });

  it('should provide error message for invalid input', () => {
    const result = MfaVerificationFormSchema.safeParse({
      verificationCode: 'abc',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeDefined();
    }
  });
});
