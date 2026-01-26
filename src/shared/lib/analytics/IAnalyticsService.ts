export const MixProperties = {
  AppletId: 'Applet ID',
  ActivityId: 'Activity ID',
  ActivityFlowId: 'Activity Flow ID',
  MindLoggerVersion: 'MindLogger Version',
  SubmitId: 'Submit ID',
  Feature: 'Feature',
  ItemTypes: 'Item Types',
  EHRStatus: 'EHR Status',

  // MFA Properties
  MFAType: 'MFA Type',
  MFAErrorCode: 'MFA Error Code',
  MFAAttemptsRemaining: 'MFA Attempts Remaining',
  MFAAttemptType: 'MFA Attempt Type',
  MFAIsAutoSubmit: 'MFA Is Auto Submit',
};

export enum MixpanelFeature {
  EHR = 'EHR',
}

export enum EHRStatus {
  ParticipantDeclined = 'Participant Declined',
  ParticipantSkipped = 'Participant Skipped',
  ParticipantConsented = 'Participant Consented',
}

export const MixEvents = {
  ActivityRestart: 'Activity Restart Button Pressed',
  ActivityResume: 'Activity Resume Button Pressed',
  AppletSelected: 'Applet Selected',
  AppletView: 'Applet View',
  AppOpen: 'App Open',
  AppReOpen: 'App Re-Open',
  AssessmentCompleted: 'Assessment completed',
  AssessmentStarted: 'Assessment started',
  EHRProviderSearch: 'EHR Provider Search',
  EHRProviderSearchSkipped: 'EHR Provider Search Skipped',
  EHRProviderShareSuccess: 'EHR Provider Share Success',
  DataView: 'Data View',
  HomeView: 'Home Page View',
  LoginSuccessful: 'Login Successful',
  NotificationTap: 'Notification tap',
  RetryButtonPressed: 'Retry button pressed',
  ReturnToActivitiesPressed: 'Return to Activities pressed',
  SignupSuccessful: 'Signup Successful',
  UploadedLogsSuccessfully: 'Uploaded Logs Successfully',
  UploadLogsError: 'Upload Logs Error Occurred',
  UploadLogsPressed: 'Upload Logs Pressed',

  // MFA Events
  MFARequired: 'MFA Required',
  MFAChallengePresented: 'MFA Challenge Presented',
  MFATOTPCodeSubmitted: 'MFA TOTP Code Submitted',
  MFARecoveryCodeSubmitted: 'MFA Recovery Code Submitted',
  MFATOTPVerificationSuccess: 'MFA TOTP Verification Success',
  MFARecoveryVerificationSuccess: 'MFA Recovery Verification Success',
  MFATOTPVerificationFailed: 'MFA TOTP Verification Failed',
  MFARecoveryVerificationFailed: 'MFA Recovery Verification Failed',
  MFASwitchToRecovery: 'MFA Switch to Recovery',
  MFASwitchToTOTP: 'MFA Switch to TOTP',
  MFASessionExpired: 'MFA Session Expired',
  MFABackToLogin: 'MFA Back to Login',
};

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, unknown>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
}
