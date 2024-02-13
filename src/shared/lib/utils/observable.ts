type ObserverFunctionBase = (...args: any[]) => void;

export class CommonObservable<
  TObserver extends ObserverFunctionBase = ObserverFunctionBase,
> {
  protected _observers: Array<TObserver>;

  constructor() {
    this._observers = [];
  }

  public addObserver(observer: TObserver) {
    this._observers.push(observer);
  }

  public removeObserver(observer: TObserver) {
    this._observers = this._observers.filter((o) => o !== observer);
  }

  public notify(...args: any[]) {
    this._observers.forEach((o) => o(...args));
  }
}
