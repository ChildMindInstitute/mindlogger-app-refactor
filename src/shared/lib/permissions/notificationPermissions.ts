import notifee, {
  AuthorizationStatus,
  AndroidNotificationSetting,
} from '@notifee/react-native';

export type NotificationPermissionStatus =
  | 'AUTHORIZED'
  | 'DENIED'
  | 'PROVISIONAL'
  | 'NOT_DETERMINED';

export type AlarmPermissionStatus = 'NOT_SUPPORTED' | 'DISABLED' | 'ENABLED';

const AuthorizationStatusMap = {
  [AuthorizationStatus.AUTHORIZED]: 'AUTHORIZED',
  [AuthorizationStatus.DENIED]: 'DENIED',
  [AuthorizationStatus.PROVISIONAL]: 'PROVISIONAL',
  [AuthorizationStatus.NOT_DETERMINED]: 'NOT_DETERMINED',
} satisfies Record<AuthorizationStatus, NotificationPermissionStatus>;

const AlarmSettingStatusMap = {
  [AndroidNotificationSetting.DISABLED]: 'DISABLED',
  [AndroidNotificationSetting.ENABLED]: 'ENABLED',
  [AndroidNotificationSetting.NOT_SUPPORTED]: 'NOT_SUPPORTED',
} satisfies Record<AndroidNotificationSetting, AlarmPermissionStatus>;

export async function getNotificationPermissions(): Promise<NotificationPermissionStatus> {
  const settings = await notifee.requestPermission();

  return AuthorizationStatusMap[settings.authorizationStatus];
}

export async function getAlarmPermissions() {
  const settings = await notifee.getNotificationSettings();

  return AlarmSettingStatusMap[settings.android.alarm];
}

export function openAlarmPermissionSettings() {
  return notifee.openAlarmPermissionSettings();
}
