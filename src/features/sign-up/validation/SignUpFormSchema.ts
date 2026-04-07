import { PASSWORD_MIN_LENGTH } from '@app/shared/lib/constants/password';
import {
  PasswordErrorKey,
  noBlankSpaces,
  hasUppercase,
  hasLowercase,
  hasDigit,
  hasSymbol,
  multiplePasswordChecks,
} from '@app/shared/lib/utils/passwordValidation';
import { z } from 'zod';

export const SignUpFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(PASSWORD_MIN_LENGTH, PasswordErrorKey.MIN_LENGTH)
    .superRefine((value, ctx) => {
      // Make sure that the password includes at least three of the following: uppercase letters, lowercase letters, digits, and symbols
      const errors = multiplePasswordChecks(value, [
        hasUppercase,
        hasLowercase,
        hasDigit,
        hasSymbol,
      ]);

      console.log('errors', errors);

      const passed = 4 - errors.length;

      if (passed < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: PasswordErrorKey.TYPES_MET,
        });

        errors.forEach(error => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error,
          });
        });
      }
    })
    .refine(noBlankSpaces, PasswordErrorKey.NO_BLANK_SPACES),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
});

export type TSignUpForm = z.infer<typeof SignUpFormSchema>;
