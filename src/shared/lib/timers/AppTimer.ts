import TimerBase from './TimerBase';

class AppTimer extends TimerBase {
  private delay: number;
  private duration?: number;
  private backgroundTimeStart?: number;
  private startTime?: number;
  private onFinish?: Function;

  constructor(
    delay: number,
    onDurationPass: Function,
    startImmediately: boolean,
    onFinish?: Function,
    duration?: number,
  ) {
    super(onDurationPass, startImmediately);
    this.delay = delay;
    this.duration = duration;
    this.onFinish = onFinish;
  }

  start(): void {
    this.startTime = Date.now();
    this.onDurationPass();
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
      this.onDurationPass();
      if (this.isDurationOver()) {
        this.stop();
        return;
      }
      this.configureInterval();
    }, customDelay);
  }

  private isDurationOver(): boolean {
    const timerTimeDiff = Date.now() - this.startTime!;
    return !!(this.duration && timerTimeDiff > this.duration);
  }

  protected onBackground(): void {
    clearInterval(this.timerId);
    this.backgroundTimeStart = Date.now();
  }

  protected onForeground(): void {
    if ((!this.backgroundTimeStart && !this.startTime) || !this.hasStarted) {
      return;
    }

    if (this.isDurationOver()) {
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
