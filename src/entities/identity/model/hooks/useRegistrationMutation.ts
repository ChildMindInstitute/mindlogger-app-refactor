import { useState } from 'react';

import { useLoginMutation } from '@app/entities/identity';
import { useSignUpMutation } from '@app/entities/identity';
import { BaseError } from '@app/shared/api';

import { IdentityModel } from '../..';

type RegistartionData = {
  email: string;
  fullName: string;
  password: string;
};

type UseRegistrationResult = {
  isLoading: boolean;
  error?: BaseError | null;
  mutate: (data: RegistartionData) => void;
};

export const useRegistrationMutation = (
  onLoginSuccess: () => void,
): UseRegistrationResult => {
  const [registrationData, setRegistrationData] = useState<RegistartionData>(
    {} as RegistartionData,
  );

  const {
    isLoading: isLoginLoading,
    mutate: login,
    error: loginError,
  } = useLoginMutation({
    onSuccess: response => {
      IdentityModel.slices.testIdentitySlice.setAuth(
        response.data.result.accessToken,
      );
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    },
  });

  const {
    isLoading: isSignUpLoading,
    isSuccess: isSignUpSuccess,
    error: signUpError,
    mutate: signUp,
  } = useSignUpMutation({
    onSuccess: () => {
      login({
        email: registrationData?.email,
        password: registrationData?.password,
      });
    },
  });

  const result: UseRegistrationResult = {
    isLoading: false,
    mutate: (data: RegistartionData) => {
      setRegistrationData(data);
      signUp(data);
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
