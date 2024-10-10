import { useEffect } from 'react';

import { UseFormReturn } from 'react-hook-form';

type UseFormChangesConfig = {
  onInputChange: (...args: any[]) => unknown;
  form: UseFormReturn<any, any>;
  watchInputs?: string[];
};

export const useFormChanges = (config: UseFormChangesConfig) => {
  useEffect(() => {
    const { onInputChange, form, watchInputs } = config;
    const inputChangeListener = form.watch((_, { name }) => {
      if (!watchInputs || (name && watchInputs?.includes(name))) {
        onInputChange();
      }
    });

    return () => inputChangeListener.unsubscribe();
  }, [config]);
};
