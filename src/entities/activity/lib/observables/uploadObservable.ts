export interface IUploadObservableSetters {
  set isLoading(value: boolean);
  set isError(value: boolean);
}

class UploadObservable implements IUploadObservableSetters {
  private _isLoading: boolean;

  private _isError: boolean;

  private _observers: Array<() => void>;

  constructor() {
    this._isLoading = false;
    this._isError = false;
    this._observers = [];
  }

  private notify() {
    this._observers.forEach(o => o());
  }

  public get isLoading() {
    return this._isLoading;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
    this.notify();
  }

  public get isError() {
    return this._isError;
  }

  public set isError(value: boolean) {
    this._isError = value;
    this.notify();
  }

  public addObserver(observer: () => void) {
    this._observers.push(observer);
  }

  public removeObserver(observer: () => void) {
    this._observers = this._observers.filter(o => o !== observer);
  }
}

export default new UploadObservable();
