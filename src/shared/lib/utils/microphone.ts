import Permissions from 'react-native-permissions';

import { MICROPHONE_PERMISSIONS } from '../constants';

const getMicrophonePermissions = async () =>
  await Permissions.request(MICROPHONE_PERMISSIONS!);

export default getMicrophonePermissions;
