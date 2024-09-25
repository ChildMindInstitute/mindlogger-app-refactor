import { httpService } from './httpService';
import {
  ApprovePasswordRecoveryRequest,
  ApprovePasswordRecoveryResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  IIdentityService,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PasswordRecoveryHealthCheckRequest,
  PasswordRecoveryHealthCheckResponse,
  PasswordRecoveryRequest,
  PasswordRecoveryResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SignUpRequest,
  SignUpResponse,
} from './IIdentityService';

export function IdentityService(): IIdentityService {
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
