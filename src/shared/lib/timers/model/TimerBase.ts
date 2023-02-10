import { AppState, NativeEventSubscription } from 'react-native';

abstract class TimerBase {
  protected listener?: NativeEventSubscription;
  protected timerId?: number;
  protected callback: Function;
  hasStarted: boolean = false;

  constructor(callback: Function, startImmediately: boolean) {
    this.callback = callback;

    this.listener = AppState.addEventListener('change', nextAppState => {
      if (
        AppState.currentState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (this.onForeground) {
          this.onForeground();
        }
      } else {
        if (this.onBackground) {
          this.onBackground();
        }
      }
    });

    if (startImmediately) {
      this.start();
    }
  }

  protected start(): void {
    this.hasStarted = true;
  }

  protected onForeground?(): void;
  protected onBackground?(): void;

  public stop(): void {
    this.hasStarted = false;
    if (this.timerId) {
      this.removeAppStateListener();
    }
  }

  protected removeAppStateListener() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}

export default TimerBase;
