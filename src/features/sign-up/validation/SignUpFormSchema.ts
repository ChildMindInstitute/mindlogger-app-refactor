import { z } from 'zod';

export const validatePassword = (password: string) => {
  const containsSpecialCharacter = /\W|_/.test(password.replace(/ /g, ''));
  const containsUpperCase = /[A-Z]/.test(password);
  const doesNotIncludeSpaces = !password.includes(' ');
  const haveMinimunLength = password.length >= 8;
  const isEmpty = password.length === 0;

  return {
    isEmpty: {
      label: 'form_item:required',
      isValid: !isEmpty,
    },
    minCharacters: {
      label: 'password_requirements:at_least_characters' || '',
      isValid: haveMinimunLength,
    },
    specialCharacters: {
      isValid: password.length > 0 && containsSpecialCharacter,
      label: 'password_requirements:no_special_characters',
    },
    upperCase: {
      isValid: password.length > 0 && containsUpperCase,
      label: 'password_requirements:at_least_capital_letter',
    },
    noSpaces: {
      isValid: password.length > 0 && doesNotIncludeSpaces,
      label: 'password_requirements:no_blank_spaces',
    },
  };
};

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z.string().superRefine((password, refinement) => {
    const { isEmpty, minCharacters, noSpaces, specialCharacters, upperCase } =
      validatePassword(password);

    !isEmpty.isValid &&
      refinement.addIssue({
        code: 'custom',
        message: isEmpty.label,
      });
    !minCharacters.isValid &&
      refinement.addIssue({
        code: 'custom',
        message: minCharacters.label,
      });
    !specialCharacters.isValid &&
      refinement.addIssue({
        code: 'custom',
        message: specialCharacters.label,
      });
    !upperCase.isValid &&
      refinement.addIssue({
        code: 'custom',
        message: upperCase.label,
      });
    !noSpaces.isValid &&
      refinement.addIssue({
        code: 'custom',
        message: noSpaces.label,
      });

    return refinement;
  }),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
});

export default schema;

export type TSignUpForm = z.infer<typeof schema>;
