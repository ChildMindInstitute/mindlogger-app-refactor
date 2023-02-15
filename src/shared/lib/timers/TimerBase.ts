import { AppState, NativeEventSubscription } from 'react-native';

abstract class TimerBase {
  protected listener?: NativeEventSubscription;
  protected timerId?: number;
  hasStarted: boolean = false;

  constructor(startImmediately: boolean) {
    this.listener = AppState.addEventListener('change', nextAppState => {
      console.log(nextAppState);
      if (
        // AppState.currentState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (this.onForeground) {
          console.log('onFore');
          this.onForeground();
        }
      } else {
        if (this.onBackground) {
          console.log(this.hasStarted, 'started');

          console.log('onBack');
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

  abstract setTimer(duration?: number): void;

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
