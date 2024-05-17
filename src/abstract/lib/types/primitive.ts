export type Point = {
  x: number;
  y: number;
};

export type StringOrNull = string | null;

export type IdName = {
  id: string;
  name: string;
};

export type AppletWithVersion = {
  appletId: string;
  version: string;
};

export type NoParamVoidFunction = () => void;

export type TimerCallbackFeedback = 'no-feedback' | 'request-for-postpone';
