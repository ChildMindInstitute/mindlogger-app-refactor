import TimerBase from './TimerBase';

class AppTimer extends TimerBase {
  private delay: number;
  private duration?: number;
  private backgroundTimeStart?: number;
  private startTime?: number;
  private onFinish?: Function;

  constructor(
    delay: number,
    callback: Function,
    startImmediately: boolean,
    onFinish?: Function,
    duration?: number,
  ) {
    super(callback, startImmediately);
    this.delay = delay;
    this.duration = duration;
    this.onFinish = onFinish;
  }

  start(): void {
    this.startTime = Date.now();
    this.callback();
    this.configureInterval();
  }

  stop() {
    super.stop();
    clearInterval(this.timerId);
    if (this.onFinish) {
      this.onFinish();
    }
  }

  private configureInterval(customDelay: number = this.delay) {
    this.timerId = setTimeout(() => {
      this.callback();
      const timerTimeDiff = Date.now() - this.startTime!;
      if (this.duration && timerTimeDiff > this.duration) {
        this.stop();
        return;
      }
      this.configureInterval();
    }, customDelay);
  }

  protected onBackground(): void {
    clearInterval(this.timerId);
    this.backgroundTimeStart = Date.now();
  }

  protected onForeground(): void {
    if ((!this.backgroundTimeStart && !this.startTime) || !this.hasStarted) {
      return;
    }

    const timerTimeDiff = Date.now() - this.startTime!;
    if (this.duration && timerTimeDiff > this.duration) {
      this.stop();
    } else {
      const timeworkdiff =
        this.duration! -
        (Date.now() - this.startTime! - this.backgroundTimeStart!);
      const newDelay = timeworkdiff % this.delay;

      this.configureInterval(newDelay);

      this.backgroundTimeStart = undefined;
    }
  }
}

export default AppTimer;
