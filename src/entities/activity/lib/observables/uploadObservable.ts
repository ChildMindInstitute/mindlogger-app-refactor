import { CommonObservable } from '@app/shared/lib';

export interface IUploadObservableSetters {
  set isLoading(value: boolean);
  set isError(value: boolean);
  set isPostponed(value: boolean);
  set isCompleted(value: boolean);
  reset(): void;
}

class UploadObservable
  extends CommonObservable
  implements IUploadObservableSetters
{
  private _isLoading: boolean;

  private _isError: boolean;

  private _isCompleted: boolean;

  private _isPostponed: boolean;

  constructor() {
    super();

    this._isLoading = false;
    this._isError = false;
    this._isCompleted = false;
    this._isPostponed = false;
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

  public get isCompleted() {
    return this._isCompleted;
  }

  public set isCompleted(value: boolean) {
    this._isCompleted = value;
    this.notify();
  }

  public get isPostponed() {
    return this._isPostponed;
  }

  public set isPostponed(value: boolean) {
    this._isPostponed = value;
    this.notify();
  }

  public reset() {
    this.isCompleted = false;
    this.isError = false;
    this.isPostponed = false;
    this.isLoading = false;
  }
}

export default new UploadObservable();
