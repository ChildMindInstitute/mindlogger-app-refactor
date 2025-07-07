// ============================================================================
// Message from Unity to ReactNative
// ============================================================================

export const UnityEventUnityStarted = 'UnityStarted';
export const UnityEventActivityCompleted = 'ActivityCompleted';

export type UnityEvent =
  | typeof UnityEventUnityStarted
  | typeof UnityEventActivityCompleted;

type U2RNMessageBase<TUnityEvent extends UnityEvent> = {
  m_sId: string;
  m_sKey: TUnityEvent;
  [key: string]: unknown;
};

export type U2RNMessageUnityStarted = U2RNMessageBase<
  typeof UnityEventUnityStarted
>;

export type U2RNMessageActivityCompleted = U2RNMessageBase<
  typeof UnityEventActivityCompleted
>;

export type U2RNMessage =
  | U2RNMessageUnityStarted
  | U2RNMessageActivityCompleted;

// ============================================================================
// Message from ReactNative to Unity
// ============================================================================

export const UnityCommandEcho = 'Echo';
export const UnityCommandReset = 'Reset';
export const UnityCommandLoadConfigFromJson = 'LoadConfigFromJson';

export type UnityCommand =
  | typeof UnityCommandEcho
  | typeof UnityCommandReset
  | typeof UnityCommandLoadConfigFromJson;

type RN2UMessageBase<TUnityCommand extends UnityCommand> = {
  m_sId: string;
  m_sKey: TUnityCommand;
  m_sAdditionalInfo?: string;
};

export type RN2UMessageEcho = RN2UMessageBase<typeof UnityCommandEcho>;

export type RN2UMessageReset = RN2UMessageBase<typeof UnityCommandReset>;

export type RN2UMessageLoadConfigFromJson = RN2UMessageBase<
  typeof UnityCommandLoadConfigFromJson
>;

export type RN2UMessage =
  | RN2UMessageEcho
  | RN2UMessageReset
  | RN2UMessageLoadConfigFromJson;
