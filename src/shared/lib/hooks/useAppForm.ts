import {
  useForm,
  UseFormProps,
  SubmitHandler,
  SubmitErrorHandler,
} from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '../validation/zodResolver';

export const useAppForm = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  props: UseFormProps<z.input<Schema>> & {
    onSubmitSuccess: SubmitHandler<z.output<Schema>>;
    onSubmitFail?: SubmitErrorHandler<z.input<Schema>>;
  },
) => {
  const form = useForm({
    ...props,
    resolver: zodResolver(schema),
  });

  const submit = form.handleSubmit(props.onSubmitSuccess, props.onSubmitFail);

  return { form, submit };
};
