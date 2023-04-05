import Permissions from 'react-native-permissions';

import { MICROPHONE_PERMISSIONS } from '../constants';

export const getMicrophonePermissions = async () =>
  await Permissions.request(MICROPHONE_PERMISSIONS!);
