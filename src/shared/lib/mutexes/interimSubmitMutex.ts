import { IInterimSubmitMutex } from './IInterimSubmitMutex';

export class InterimSubmitMutex implements IInterimSubmitMutex {
  private _processing: boolean = false;

  public setBusy() {
    this._processing = true;
  }

  public release() {
    this._processing = false;
  }

  public isBusy() {
    return this._processing;
  }
}
