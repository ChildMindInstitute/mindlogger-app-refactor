import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

import { RN2UMessage, U2RNMessage } from './unityMessage';

export const enum UnityType {}

export type UnityResult = {
  responseType: 'unity';
  startTime: number;
  taskData: MediaFile[];
};

export type UnityFailureMode = 'unloaded' | 'quit';

export type UseUnityFailureHandlerOptions = {
  flowId: string | undefined;
  stopHeartbeat: () => void;
  onError?: () => void;
};

export type UseUnityFailureHandlerResult = {
  showErrorModal: boolean;
  triggerFailure: () => void;
  handleErrorModalDismiss: () => void;
  resetFailureState: () => void;
  suppressErrors: () => void;
};

export type UseUnityHeartbeatOptions = {
  sendMessageToUnity: (message: RN2UMessage) => Promise<U2RNMessage | null>;
  onFirstFailure?: () => void;
  onMaxFailuresReached?: () => void;
};
