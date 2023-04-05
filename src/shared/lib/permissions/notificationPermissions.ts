import notifee, { AuthorizationStatus } from '@notifee/react-native';

export type NotificationPermissionStatus =
  | 'AUTHORIZED'
  | 'DENIED'
  | 'PROVISIONAL'
  | 'NOT_DETERMINED';

const AuthorizationStatusMap = {
  [AuthorizationStatus.AUTHORIZED]: 'AUTHORIZED',
  [AuthorizationStatus.DENIED]: 'DENIED',
  [AuthorizationStatus.PROVISIONAL]: 'PROVISIONAL',
  [AuthorizationStatus.NOT_DETERMINED]: 'NOT_DETERMINED',
} satisfies Record<AuthorizationStatus, NotificationPermissionStatus>;

export async function getNotificationPermissions(): Promise<NotificationPermissionStatus> {
  const settings = await notifee.requestPermission();

  return AuthorizationStatusMap[settings.authorizationStatus];
}
