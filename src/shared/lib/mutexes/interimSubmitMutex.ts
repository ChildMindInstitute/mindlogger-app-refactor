import { IMutex } from '../utils';

class InterimSubmitMutex implements IMutex {
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

export default new InterimSubmitMutex();
