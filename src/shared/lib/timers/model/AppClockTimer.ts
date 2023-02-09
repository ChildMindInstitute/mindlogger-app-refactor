import TimerBase from './TimerBase';
import { ONE_MINUTE } from '../../constants';

class AppClockTimer extends TimerBase {
  constructor(
    onMinutePass: () => void,
    startImmediately: boolean,
    onFinish?: () => void,
  ) {
    super(onMinutePass, startImmediately, onFinish);
  }

  private getTimeToNextFullMinute(date: number): number {
    return ONE_MINUTE - (date % ONE_MINUTE);
  }

  execute() {
    this.timerId = setTimeout(() => {
      this.callback();
      this.execute();
    }, this.getTimeToNextFullMinute(Date.now()));
  }
}

export default AppClockTimer;
