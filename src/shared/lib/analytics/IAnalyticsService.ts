export const MixProperties = {
  AppletId: 'Applet ID',
  ActivityId: 'Activity ID',
  ActivityFlowId: 'Activity Flow ID',
  MindLoggerVersion: 'MindLogger Version',
  SubmitId: 'Submit ID',
  Feature: 'Feature',
  ItemTypes: 'Item Types',
  EHRStatus: 'EHR Status',
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
};

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, unknown>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
}
