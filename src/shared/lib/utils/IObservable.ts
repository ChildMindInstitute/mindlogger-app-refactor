export type ObserverFunctionBase = (...args: any[]) => void | Promise<void>;

export interface IObservable {
  notify: () => void;
}
