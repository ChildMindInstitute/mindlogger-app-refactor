import TimerBase from './TimerBase';
import { ONE_MINUTE } from '../../constants';

class AppClockTimer extends TimerBase {
  onFinish?: Function;
  constructor(
    onMinutePass: () => void,
    startImmediately: boolean,
    onFinish?: Function,
  ) {
    super(onMinutePass, startImmediately);
    this.onFinish = onFinish;
  }

  private getTimeToNextFullMinute(date: number): number {
    return ONE_MINUTE - (date % ONE_MINUTE);
  }

  start(): void {
    this.callback();
    this.setTimer();
  }

  setTimer() {
    this.timerId = setTimeout(() => {
      this.callback();
      this.setTimer();
    }, this.getTimeToNextFullMinute(Date.now()));
  }

  stop() {
    super.stop();
    clearTimeout(this.timerId);
    if (this.onFinish) {
      this.onFinish();
    }
  }

  protected onForeground(): void {
    if (this.hasStarted) {
      this.setTimer();
    }
  }
}

export default AppClockTimer;
