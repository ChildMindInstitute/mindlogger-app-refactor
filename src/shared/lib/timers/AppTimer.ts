import TimerBase from './TimerBase';

class AppTimer extends TimerBase {
  private duration: number;
  private startTime?: number;
  private onFinish: Function;

  constructor(onFinish: Function, startImmediately: boolean, duration: number) {
    super(startImmediately);
    this.duration = duration;
    this.onFinish = onFinish;
  }

  start(): void {
    super.start();
    this.startTime = Date.now();
    this.setTimer();
  }

  stop() {
    super.stop();
    clearTimeout(this.timerId);
  }

  setTimer(duration = this.duration) {
    this.timerId = setTimeout(() => {
      this.onFinish();
    }, duration);
  }

  private isDurationOver(): boolean {
    const timerTimeDiff = Date.now() - this.startTime!;
    return !!(this.duration && timerTimeDiff > this.duration);
  }

  private geTimeLeftAterBackground() {
    return this.duration - (Date.now() - this.startTime!);
  }

  protected onBackground(): void {
    clearTimeout(this.timerId);
  }

  protected onForeground(): void {
    if (!this.startTime || !this.hasStarted) {
      return;
    }

    if (this.isDurationOver()) {
      console.log('DurationOver');

      this.stop();
    } else {
      const timeLeft = this.geTimeLeftAterBackground();
      console.log(timeLeft);

      this.setTimer(timeLeft);
    }
  }
}

export default AppTimer;
