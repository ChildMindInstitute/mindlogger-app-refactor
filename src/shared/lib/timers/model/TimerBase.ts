import { AppState, NativeEventSubscription } from 'react-native';

let backgroundMoveTime: number | null = null;

abstract class TimerBase {
  protected listener?: NativeEventSubscription;
  protected timerId?: number;
  protected onFinish?: Function;
  protected callback: Function;

  constructor(
    callback: Function,
    startImmediately: boolean,
    onFinish?: Function,
  ) {
    this.callback = callback;
    this.onFinish = onFinish;

    this.listener = AppState.addEventListener('change', nextAppState => {
      if (
        AppState.currentState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (backgroundMoveTime) {
          this.execute();
          backgroundMoveTime = null;
        }
      } else {
        backgroundMoveTime = Date.now();
      }
    });

    if (startImmediately) {
      this.start();
    }
  }

  abstract execute(): void;

  public start() {
    this.callback();
    this.execute();
  }

  public cancel() {
    this.stopTimer();
    if (this.onFinish) {
      this.onFinish();
    }
  }

  protected stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.removeAppStateListener();
      backgroundMoveTime = null;
    }
  }

  protected removeAppStateListener() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}

export default TimerBase;
