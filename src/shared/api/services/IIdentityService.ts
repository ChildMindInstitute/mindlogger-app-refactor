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

// Standard login response (when MFA is not enabled)
export type LoginSuccessResponse = SuccessfulResponse<{
  token: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
  };
  user: UserDto;
}>;

// MFA challenge response (when MFA is enabled)
// Note: Backend returns snake_case but gets transformed to camelCase by API layer
export type LoginMfaRequiredResponse = SuccessfulResponse<{
  mfa_required?: true; // snake_case version (if not transformed)
  mfaRequired?: true; // camelCase version (after transformation)
  mfa_session_id?: string;
  mfaSessionId?: string;
  mfa_token?: string;
  mfaToken?: string;
}>;

// Union type for login response
export type LoginResponse = LoginSuccessResponse | LoginMfaRequiredResponse;

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

// MFA verification request (for 6-digit TOTP codes)
export type MfaVerifyRequest = {
  mfa_token: string;
  totp_code: string;
  device_id?: string;
};

// MFA verification response
// Note: Backend returns snake_case but may get transformed to camelCase
export type MfaVerifyResponse = SuccessfulResponse<{
  token: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
  };
  user: UserDto;
}>;

// MFA recovery request (for backup codes)
export type MfaRecoveryRequest = {
  mfa_token: string;
  code: string;
  device_id?: string;
};

// MFA recovery response
// Note: Backend returns snake_case but may get transformed to camelCase
export type MfaRecoveryResponse = SuccessfulResponse<{
  token: {
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
  };
  user: UserDto;
}>;

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
  
  // MFA verification methods
  mfaVerify: (
    request: MfaVerifyRequest,
  ) => Promise<AxiosResponse<MfaVerifyResponse>>;
  mfaRecovery: (
    request: MfaRecoveryRequest,
  ) => Promise<AxiosResponse<MfaRecoveryResponse>>;
};
