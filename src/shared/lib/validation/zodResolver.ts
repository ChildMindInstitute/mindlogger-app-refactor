import { toNestError, validateFieldsNatively } from '@hookform/resolvers';
import { appendErrors, FieldError as BaseFieldError, FieldErrors } from 'react-hook-form';
import { z } from 'zod';

import type { Resolver } from './types';

type FieldError = BaseFieldError & {
  params: Record<string, any>;
};

const parseErrorSchema = (zodErrors: z.ZodIssue[], validateAllFieldCriteria: boolean) => {
  const errors: Record<string, FieldError> = {};

  for (; zodErrors.length; ) {
    const error = zodErrors[0];
    const { code, message, path, ...params } = error;
    const _path = path.join('.');

    if (!errors[_path]) {
      if ('unionErrors' in error) {
        const unionError = error.unionErrors[0].errors[0];

        errors[_path] = {
          message: unionError.message,
          type: unionError.code,
          params,
        };
      } else {
        errors[_path] = { message, type: code, params };
      }
    }

    if ('unionErrors' in error) {
      error.unionErrors.forEach((unionError) => unionError.errors.forEach((e) => zodErrors.push(e)));
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
        messages ? ([] as string[]).concat(messages as any as string[], error.message) : error.message,
      ) as FieldError;
    }

    zodErrors.shift();
  }

  return errors;
};

const zodResolver: Resolver = (schema, schemaOptions, resolverOptions = {}) => {
  return async (values, _, options) => {
    try {
      const data = await schema[resolverOptions.mode === 'sync' ? 'parse' : 'parseAsync'](values, schemaOptions);

      options.shouldUseNativeValidation && validateFieldsNatively({}, options);

      return {
        errors: {} as FieldErrors,
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
          errors: toNestError(
            parseErrorSchema(error.errors, !options.shouldUseNativeValidation && options.criteriaMode === 'all'),
            options,
          ),
        };
      }
    }
  };
};

export default zodResolver;
