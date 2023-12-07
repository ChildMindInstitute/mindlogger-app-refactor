export type Point = {
  x: number;
  y: number;
};

export type StringOrNull = string | null;

export type IdName = { name: string; id: string };

export type AppletWithVersion = {
  appletId: string;
  version: string;
};
