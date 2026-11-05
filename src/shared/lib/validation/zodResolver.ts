import { toNestErrors, validateFieldsNatively } from '@hookform/resolvers';
import { appendErrors, FieldError as BaseFieldError } from 'react-hook-form';
import { z } from 'zod';

import type { Resolver } from './types';

type FieldError = BaseFieldError & {
  params: Record<string, any>;
};

const parseErrorSchema = (
  zodErrors: z.ZodIssue[],
  validateAllFieldCriteria: boolean,
) => {
  const errors: Record<string, FieldError> = {};

  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const { code, message, path, ...params } = error;
    const _path = path.join('.');

    if (!errors[_path]) {
      if (error.code === 'invalid_union' && error.errors[0]?.[0]) {
        const unionError = error.errors[0][0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
          params,
        };
      } else {
        errors[_path] = { message, type: code, params };
      }
    }

    // zod 4 union issues have paths relative to the union
    if (error.code === 'invalid_union') {
      error.errors.forEach(unionErrors =>
        unionErrors.forEach(e =>
          zodErrors.push({ ...e, path: [...path, ...e.path] }),
        ),
      );
    }

    if (validateAllFieldCriteria) {
      const types = errors[_path].types;
      const messages = types && types[error.code];

      errors[_path] = appendErrors(
        _path,
        validateAllFieldCriteria,
        errors,
        code,
        //@ts-ignore
        messages
          ? ([] as string[]).concat(messages as any as string[], error.message)
          : error.message,
      ) as FieldError;
    }

    zodErrors.shift();
  }

  return errors;
};

export const zodResolver: Resolver = (
  schema,
  schemaOptions,
  resolverOptions = {},
) => {
  return async (values, _, options) => {
    try {
      const data = await schema[
        resolverOptions.mode === 'sync' ? 'parse' : 'parseAsync'
      ](values, schemaOptions);

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        errors: {},
        values: resolverOptions.rawValues ? values : data,
      };
    } catch (error: any) {
      if (error.isEmpty) {
        return {
          values: {},
          errors: {},
        };
      } else {
        return {
          values: {},
          errors: toNestErrors(
            parseErrorSchema(
              error.issues,
              !options.shouldUseNativeValidation &&
                options.criteriaMode === 'all',
            ),
            options,
          ),
        };
      }
    }
  };
};
