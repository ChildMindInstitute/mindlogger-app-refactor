// Tracks the latest activity/flow start so a slower, older start
// (e.g. from a notification tap) doesn't navigate over a newer one.
let latestToken = 0;

export const beginEntityStart = (): number => ++latestToken;

export const isLatestEntityStart = (token: number): boolean =>
  token === latestToken;
