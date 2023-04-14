import TimerBase from './TimerBase';
import { ONE_MINUTE } from '../constants';

class AppClockTimer extends TimerBase {
  onMinutePass: (...args: any[]) => unknown;

  constructor(
    onMinutePass: (...args: any[]) => unknown,
    startImmediately: boolean,
  ) {
    super();
    this.onMinutePass = onMinutePass;

    if (startImmediately) {
      this.start();
    }
  }

  private getTimeToNextFullMinute(date: number): number {
    return ONE_MINUTE - (date % ONE_MINUTE);
  }

  start(): void {
    this.setTimer();
  }

  setTimer() {
    this.timerId = setTimeout(() => {
      this.onMinutePass();
      this.setTimer();
    }, this.getTimeToNextFullMinute(Date.now()));
  }

  stop() {
    super.stop();
    clearTimeout(this.timerId);
  }

  onForeground(): void {
    if (this.hasStarted) {
      clearTimeout(this.timerId);
      this.setTimer();
    }
  }
}

export default AppClockTimer;
