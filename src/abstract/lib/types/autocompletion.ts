export type SafeChecks =
  | 'in-progress-activity'
  | 'refresh'
  | 'start-entity'
  | 'uploading'
  | 'already-opened'
  | 'is-offline';

export type LogAutocompletionTrigger =
  | 'app-start'
  | 'to-foreground'
  | 'to-online'
  | 'check-availability'
  | 'close-entity'
  | 'expired-while-alert-opened'
  | 'retry-on-banner'
  | 'app-level-timer';

export type AutocompletionExecuteOptions = {
  checksToExclude?: Array<SafeChecks>;
  checksToInclude?: Array<SafeChecks>;
  forceUpload?: boolean;
};

export type AutocompletionEventOptions = AutocompletionExecuteOptions & {
  logTrigger: LogAutocompletionTrigger;
};
