type TimeoutId = ReturnType<typeof setTimeout>;

type IntervalId = ReturnType<typeof setInterval>;

type Maybe<TValue> = TValue | null | undefined;
declare module 'crypto-browserify' {
  const crypto: any;
  export = crypto;
}
