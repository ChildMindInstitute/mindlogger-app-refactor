import {
  IObservable,
  ObserverFunctionBase,
} from '@shared/lib/utils/IObservable.ts';

export class CommonObservable<
  TObserver extends ObserverFunctionBase = ObserverFunctionBase,
> implements IObservable
{
  protected _observers: Array<TObserver>;

  constructor() {
    this._observers = [];
  }

  public addObserver(observer: TObserver) {
    this._observers.push(observer);
  }

  public removeObserver(observer: TObserver) {
    this._observers = this._observers.filter(o => o !== observer);
  }

  public notify(...args: any[]) {
    this._observers.forEach(o => o(...args));
  }

  public async notifyAsync(...args: any[]) {
    for (const observer of this._observers) {
      await observer(...args);
    }
  }
}
