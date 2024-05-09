import { t } from 'i18next';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH } from '@app/shared/lib';

const schema = z.object({
  prev_password: z
    .string()
    .min(1, 'form_item:required')
    .min(
      PASSWORD_MIN_LENGTH,
      t('change_pass_form:password_at_least_characters', {
        min: PASSWORD_MIN_LENGTH,
      }),
    ),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(
      PASSWORD_MIN_LENGTH,
      t('change_pass_form:password_at_least_characters', {
        min: PASSWORD_MIN_LENGTH,
      }),
    )
    .refine(value => !value.includes(' '), 'sign_up_form:password_no_spaces'),
});

export default schema;
