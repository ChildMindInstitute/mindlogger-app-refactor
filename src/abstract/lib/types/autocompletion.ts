export type SafeChecks =
  | 'in-progress-activity'
  | 'refresh'
  | 'start-entity'
  | 'uploading'
  | 'already-opened';

export type LogAutocompletionTrigger =
  | 'app-start'
  | 'to-foreground'
  | 'to-online'
  | 'check-availability'
  | 'close-entity'
  | 'expired-while-alert-opened'
  | 'retry-on-banner';

export type AutocompletionExecuteOptions = {
  checksToExclude?: Array<SafeChecks>;
  forceUpload?: boolean;
};

export type AutocompletionEventOptions = AutocompletionExecuteOptions & {
  logTrigger: LogAutocompletionTrigger;
};
