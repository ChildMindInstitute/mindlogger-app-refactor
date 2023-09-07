import { AppState, NativeEventSubscription } from 'react-native';

abstract class TimerBase {
  protected listener?: NativeEventSubscription;
  protected timerId?: number;
  hasStarted: boolean = false;

  protected start(): void {
    this.hasStarted = true;

    if (this.listener) {
      return;
    }

    this.listener = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        if (this.onForeground) {
          this.onForeground();
        }
      } else {
        if (this.onBackground) {
          this.onBackground();
        }
      }
    });
  }

  abstract setTimer(duration?: number): void;

  protected onForeground?(): void;
  protected onBackground?(): void;

  public stop(): void {
    this.hasStarted = false;
    this.removeAppStateListener();
  }

  protected removeAppStateListener() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}

export default TimerBase;
