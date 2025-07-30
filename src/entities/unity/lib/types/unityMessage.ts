// ============================================================================
// Message from Unity to ReactNative
// ============================================================================

export const UnityEventUnityStarted = 'UnityStarted';
export const UnityEventEndUnity = 'EndUnity';
export const UnityEventActivityCompleted = 'ActivityCompleted';
export const UnityEventDataExport = 'DataExport';

export type UnityEvent =
  | typeof UnityEventUnityStarted
  | typeof UnityEventEndUnity
  | typeof UnityEventActivityCompleted
  | typeof UnityEventDataExport;

type U2RNMessageBase<TUnityEvent extends UnityEvent> = {
  m_sId: string;
  m_sKey: TUnityEvent;
  [key: string]: unknown;
};

export type U2RNMessageUnityStarted = U2RNMessageBase<
  typeof UnityEventUnityStarted
>;

export type U2RNMessageEndUnity = U2RNMessageBase<typeof UnityEventEndUnity>;

export type U2RNMessageActivityCompleted = U2RNMessageBase<
  typeof UnityEventActivityCompleted
>;

export type U2RNMessageDataExport = U2RNMessageBase<
  typeof UnityEventDataExport
> & {
  m_listDataPaths: Array<string>;
};

export type U2RNMessage =
  | U2RNMessageUnityStarted
  | U2RNMessageEndUnity
  | U2RNMessageActivityCompleted
  | U2RNMessageDataExport;

// ============================================================================
// Message from ReactNative to Unity
// ============================================================================

export const UnityCommandEcho = 'Echo';
export const UnityCommandReset = 'Reset';
export const UnityCommandLoadConfigFile = 'LoadConfigFile';
export const UnityCommandLoadConfigFromJson = 'LoadConfigFromJson';

export type UnityCommand =
  | typeof UnityCommandEcho
  | typeof UnityCommandReset
  | typeof UnityCommandLoadConfigFile
  | typeof UnityCommandLoadConfigFromJson;

type RN2UMessageBase<TUnityCommand extends UnityCommand> = {
  m_sId: string;
  m_sKey: TUnityCommand;
  m_sAdditionalInfo?: string;
};

export type RN2UMessageEcho = RN2UMessageBase<typeof UnityCommandEcho>;

export type RN2UMessageReset = RN2UMessageBase<typeof UnityCommandReset>;

export type RN2UMessageLoadConfigFile = RN2UMessageBase<
  typeof UnityCommandLoadConfigFile
>;

export type RN2UMessageLoadConfigFromJson = RN2UMessageBase<
  typeof UnityCommandLoadConfigFromJson
>;

export type RN2UMessage =
  | RN2UMessageEcho
  | RN2UMessageReset
  | RN2UMessageLoadConfigFile
  | RN2UMessageLoadConfigFromJson;
