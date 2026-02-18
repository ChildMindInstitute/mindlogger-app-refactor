import { MfaRecoveryFormSchema } from '../MfaRecoveryFormSchema';

describe('MfaRecoveryFormSchema', () => {
  it('should accept valid recovery codes in XXXXX-XXXXX format', () => {
    const validCodes = [
      'ABCDE-12345',
      'A1B2C-3D4E5',
      '12345-ABCDE',
      'ZZZZZ-99999',
      'abcde-12345', // lowercase should be allowed (transformed to uppercase)
    ];

    validCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(true);
    });
  });

  it('should reject codes without hyphen', () => {
    const invalidCodes = ['ABCDE12345', '1234567890', 'ABCDEFGHIJ'];

    invalidCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(false);
    });
  });

  it('should reject codes with wrong format (not 5-5)', () => {
    const invalidCodes = [
      'ABCD-12345', // 4-5
      'ABCDE-1234', // 5-4
      'ABC-123', // 3-3
      'ABCDEF-123456', // 6-6
    ];

    invalidCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(false);
    });
  });

  it('should reject codes with special characters', () => {
    const invalidCodes = [
      'AB!DE-12345',
      'ABCDE-123@5',
      'AB DE-12345',
      'ABCDE 12345',
    ];

    invalidCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(false);
    });
  });

  it('should reject empty or too short codes', () => {
    const invalidCodes = ['', 'A', 'AB-CD', 'ABCDE-'];

    invalidCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(false);
    });
  });

  it('should reject codes that are too long', () => {
    const invalidCodes = ['ABCDE-12345-EXTRA', 'ABCDEF-123456', 'ABCDE-123456'];

    invalidCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(false);
    });
  });

  it('should provide error message for invalid input', () => {
    const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: 'invalid' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBeDefined();
    }
  });

  it('should accept mixed alphanumeric codes', () => {
    const validCodes = ['A1B2C-3D4E5', '1A2B3-4C5D6', 'Z9X8Y-7W6V5'];

    validCodes.forEach(code => {
      const result = MfaRecoveryFormSchema.safeParse({ recoveryCode: code });
      expect(result.success).toBe(true);
    });
  });
});
