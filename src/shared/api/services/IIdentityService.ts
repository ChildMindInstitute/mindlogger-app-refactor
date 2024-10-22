import { AxiosResponse } from 'axios';

import { SuccessfulEmptyResponse, SuccessfulResponse } from '../types';

export type LoginRequest = {
  email: string;
  password: string;
  deviceId?: string;
};

export type LogoutRequest = {
  deviceId: string;
};

export type SignUpRequest = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type PasswordRecoveryRequest = {
  email: string;
};

export type ApprovePasswordRecoveryRequest = {
  email: string;
  key: string;
  password: string;
};

export type PasswordRecoveryHealthCheckRequest = {
  email: string;
  key: string;
};

export type ChangePasswordRequest = {
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

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = SuccessfulResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type LogoutResponse = SuccessfulEmptyResponse;

export type SignUpResponse = SuccessfulEmptyResponse;

export type PasswordRecoveryResponse = SuccessfulEmptyResponse;

export type ApprovePasswordRecoveryResponse = SuccessfulEmptyResponse;

export type PasswordRecoveryHealthCheckResponse = SuccessfulEmptyResponse;

export type ChangePasswordResponse = SuccessfulEmptyResponse;

export type IIdentityService = {
  login: (request: LoginRequest) => Promise<AxiosResponse<LoginResponse>>;
  logout: (request: LogoutRequest) => Promise<AxiosResponse<LogoutResponse>>;
  signUp: (request: SignUpRequest) => Promise<AxiosResponse<SignUpResponse>>;
  passwordRecover: (
    request: PasswordRecoveryRequest,
  ) => Promise<AxiosResponse<PasswordRecoveryResponse>>;
  approvePasswordRecovery: (
    request: ApprovePasswordRecoveryRequest,
  ) => Promise<AxiosResponse<ApprovePasswordRecoveryResponse>>;
  passwordRecoveryHealthCheck: (
    request: PasswordRecoveryHealthCheckRequest,
  ) => Promise<AxiosResponse<PasswordRecoveryHealthCheckResponse>>;
  refreshToken: (
    request: RefreshTokenRequest,
  ) => Promise<AxiosResponse<RefreshTokenResponse>>;
  changePassword: (
    request: ChangePasswordRequest,
  ) => Promise<AxiosResponse<ChangePasswordResponse>>;
};
