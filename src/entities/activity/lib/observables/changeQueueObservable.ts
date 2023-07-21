export interface IChangeQueueObservable {
  notify: (hasItems: boolean) => void;
}

class ChangeQueueObservable implements IChangeQueueObservable {
  private _observers: Array<(hasItems: boolean) => void>;

  constructor() {
    this._observers = [];
  }

  public notify(hasItems: boolean) {
    this._observers.forEach(o => o(hasItems));
  }

  public addObserver(observer: () => void) {
    this._observers.push(observer);
  }

  public removeObserver(observer: () => void) {
    this._observers = this._observers.filter(o => o === observer);
  }
}

export default new ChangeQueueObservable();
