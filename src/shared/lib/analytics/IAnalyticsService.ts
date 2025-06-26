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
  DataView: 'Data View',
  AppletView: 'Applet View',
  HomeView: 'Home Page View',
  AssessmentStarted: 'Assessment started',
  AssessmentCompleted: 'Assessment completed',
  RetryButtonPressed: 'Retry button pressed',
  LoginSuccessful: 'Login Successful',
  SignupSuccessful: 'Signup Successful',
  AppOpen: 'App Open',
  AppReOpen: 'App Re-Open',
  ActivityRestart: 'Activity Restart Button Pressed',
  ActivityResume: 'Activity Resume Button Pressed',
  AppletSelected: 'Applet Selected',
  ReturnToActivitiesPressed: 'Return to Activities pressed',
  UploadLogsPressed: 'Upload Logs Pressed',
  UploadedLogsSuccessfully: 'Uploaded Logs Successfully',
  UploadLogsError: 'Upload Logs Error Occurred',
  NotificationTap: 'Notification tap',
};

export interface IAnalyticsService {
  track(action: string, payload?: Record<string, unknown>): void;
  login(id: string): Promise<void>;
  logout(): void;
  init(): Promise<void>;
}
