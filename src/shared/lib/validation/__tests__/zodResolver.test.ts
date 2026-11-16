import { ResolverOptions } from 'react-hook-form';

import { PasswordRecoveryFormSchema } from '@app/features/password-recovery/model/PasswordRecoveryFormSchema';
import { PasswordErrorKey } from '@app/shared/lib/utils/passwordValidation';

import { zodResolver } from '../zodResolver';

type FormValues = { newPassword: string; confirmPassword: string };

const options = {
  fields: {},
  shouldUseNativeValidation: false,
} as ResolverOptions<FormValues>;

const resolve = (values: FormValues) =>
  zodResolver(PasswordRecoveryFormSchema)(values, undefined, options);

describe('zodResolver', () => {
  it('maps a custom issue with its message and params', async () => {
    const { errors } = await resolve({
      newPassword: 'abcdefghijkl',
      confirmPassword: 'abcdefghijkl',
    });

    expect(errors).toMatchObject({
      newPassword: {
        message: PasswordErrorKey.MUST_INCLUDE,
        type: 'custom',
        params: { params: { minLength: 10, types: 3 } },
      },
    });
  });

  it('maps a refine issue to its path', async () => {
    const { errors } = await resolve({
      newPassword: 'Abcdefgh1!xy',
      confirmPassword: 'different',
    });

    expect(errors).toMatchObject({
      confirmPassword: {
        message: 'password_recovery_form:passwords_do_not_match',
        type: 'custom',
      },
    });
  });
});
