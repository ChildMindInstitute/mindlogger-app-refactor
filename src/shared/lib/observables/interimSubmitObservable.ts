import { CommonObservable } from '../utils';

export interface IInterimSubmitObservable {
  notify: () => void;
}

class InterimSubmitObservable
  extends CommonObservable
  implements IInterimSubmitObservable
{
  constructor() {
    super();
  }

  private _processing: boolean = false;

  public get processing() {
    return this._processing;
  }

  public set processing(value: boolean) {
    this._processing = value;
    super.notify(value);
  }

  public reset() {
    this.processing = false;
  }
}

export default new InterimSubmitObservable();
