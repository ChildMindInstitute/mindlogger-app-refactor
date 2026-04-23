import { useEffect, useState } from 'react';

import { Control, FieldValues, Path, useWatch } from 'react-hook-form';

type UsePasswordFieldStateParams<T extends FieldValues> = {
  control: Control<T>;
  fieldName?: Path<T>;
};

export const usePasswordFieldState = <T extends FieldValues>({
  control,
  fieldName = 'password' as Path<T>,
}: UsePasswordFieldStateParams<T>) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isFirstTimeFocused, setIsFirstTimeFocused] = useState(true);
  const [shouldHideError, setShouldHideError] = useState(true);

  const passwordValue = String(useWatch({ control, name: fieldName }) ?? '');

  const updateHideError = () => {
    if (passwordValue) {
      setShouldHideError(true);
    } else {
      setShouldHideError(false);
    }
  };

  useEffect(() => {
    updateHideError();
  }, [passwordValue]);

  const passwordFieldProps = {
    hideError: isPasswordFocused || shouldHideError,
    onFocus: () => setIsPasswordFocused(true),
    onBlur: () => {
      setIsPasswordFocused(false);
      setIsFirstTimeFocused(false);
    },
  };

  const checklistProps = {
    isPasswordFocused,
    isFirstTimeFocused,
  };

  const handleSubmitPress = (submitFn: () => void) => {
    updateHideError();
    submitFn();
  };

  return {
    passwordFieldProps,
    checklistProps,
    handleSubmitPress,
  };
};
