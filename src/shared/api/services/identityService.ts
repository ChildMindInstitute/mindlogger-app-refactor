import httpService from './httpService';
import { SuccessfulEmptyResponse, SuccessfulResponse } from '../types';

type LoginRequest = {
  email: string;
  password: string;
  deviceId?: string;
};

type LogoutRequest = {
  deviceId: string;
};

type SignUpRequest = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type PasswordRecoveryRequest = {
  email: string;
};

type ApprovePasswordRecoveryRequest = {
  email: string;
  key: string;
  password: string;
};

type PasswordRecoveryHealthCheckRequest = {
  email: string;
  key: string;
};

type ChangePasswordRequest = {
  password: string;
  prev_password: string;
};

export type LoginResponse = SuccessfulResponse<{
  token: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
  user: UserDto;
}>;

type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

export type ApprovePasswordRecoveryResponse = SuccessfulEmptyResponse;

export type PasswordRecoveryHealthCheckResponse = SuccessfulEmptyResponse;

export type ChangePasswordResponse = SuccessfulEmptyResponse;

function IdentityService() {
  return {
    login(request: LoginRequest) {
      return httpService.post<LoginResponse>('/auth/login', request);
    },
    logout(request: LogoutRequest) {
      return httpService.post<LogoutResponse>('/auth/logout', request);
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
    approvePasswordRecovery(request: ApprovePasswordRecoveryRequest) {
      return httpService.post<ApprovePasswordRecoveryResponse>(
        '/users/me/password/recover/approve',
        request,
      );
    },
    passwordRecoveryHealthCheck(request: PasswordRecoveryHealthCheckRequest) {
      return httpService.get<PasswordRecoveryHealthCheckResponse>(
        '/users/me/password/recover/healthcheck',
        {
          params: request,
        },
      );
    },
    refreshToken(request: RefreshTokenRequest) {
      return httpService.post<RefreshTokenResponse>(
        '/auth/token/refresh',
        request,
      );
    },
    changePassword(request: ChangePasswordRequest) {
      return httpService.put<ChangePasswordResponse>(
        '/users/me/password',
        request,
      );
    },
  };
}

export default IdentityService();
