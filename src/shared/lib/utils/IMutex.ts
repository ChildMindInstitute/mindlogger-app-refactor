export interface IMutex {
  setBusy: () => void;
  release: () => void;
  isBusy: () => boolean;
}
