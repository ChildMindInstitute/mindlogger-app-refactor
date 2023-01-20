import { useLoginMutation } from '@app/entities/identity';
import { useSignUpMutation } from '@app/entities/identity';
import { BaseError } from '@app/shared/api';
import { useAppDispatch } from '@app/shared/lib';

import { IdentityModel } from '../..';

type RegistartionData = {
  email: string;
  fullName: string;
  password: string;
};

type UseRegistrationReturn = {
  isLoading: boolean;
  error?: BaseError | null;
  mutate: (data: RegistartionData) => void;
};

export const useRegistrationMutation = (
  onSuccess: () => void,
): UseRegistrationReturn => {
  const dispatch = useAppDispatch();

  const {
    isLoading: isLoginLoading,
    mutate: login,
    error: loginError,
  } = useLoginMutation({
    onSuccess: response => {
      dispatch(
        IdentityModel.actions.onAuthSuccess(response.data.result.accessToken),
      );
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const {
    isLoading: isSignUpLoading,
    isSuccess: isSignUpSuccess,
    error: signUpError,
    mutate: signUp,
  } = useSignUpMutation();

  const result: UseRegistrationReturn = {
    isLoading: false,
    mutate: (data: RegistartionData) => {
      signUp(data, {
        onSuccess: () => login({ email: data.email, password: data.password }),
      });
    },
  };

  if (isSignUpSuccess) {
    result.error = loginError;
    result.isLoading = isLoginLoading;
  } else {
    result.error = signUpError;
    result.isLoading = isSignUpLoading;
  }

  return result;
};
