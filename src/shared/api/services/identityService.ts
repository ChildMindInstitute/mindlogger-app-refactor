import httpService from './httpService';
import { SuccessfulEmptyResponse, SuccessfulResponse } from '../types';

type LoginRequest = {
  email: string;
  password: string;
};

type LogoutRequest = {
  pk: number;
};

type SignUpRequest = {
  email: string;
  fullName: string;
  password: string;
};

type PasswordRecoveryRequest = {
  email: string;
};

export type LoginResponse = SuccessfulResponse<{
  accessToken: string;
  user: UserDto;
}>;

type UserDto = {
  id: string;
  name: string;
};

type RefreshTokenRequest = {
  refreshToken: string;
};

type RefreshTokenResponse = SuccessfulResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type LogoutResponse = SuccessfulEmptyResponse;

export type SignUpResponse = SuccessfulEmptyResponse;

export type PasswordRecoveryResponse = SuccessfulEmptyResponse;

function IdentityService() {
  return {
    login(request: LoginRequest) {
      return httpService.post<LoginResponse>('/auth/token', request);
    },
    logout(request: LogoutRequest) {
      return httpService.delete<LogoutResponse>(`/auth/token${request.pk}`);
    },
    signUp(request: SignUpRequest) {
      return httpService.post<SignUpResponse>('/users', request);
    },
    passwordRecover(request: PasswordRecoveryRequest) {
      return httpService.post<PasswordRecoveryResponse>(
        '/users/me/password/recover',
        request,
      );
    },
    refreshToken(request: RefreshTokenRequest) {
      return httpService.post<RefreshTokenResponse>(
        '/auth/token/refresh',
        request,
      );
    },
  };
}

export default IdentityService();
