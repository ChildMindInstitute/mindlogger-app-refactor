import TimerBase from './TimerBase';

class AppTimer extends TimerBase {
  private duration: number;
  private startTime?: number;
  private onFinish: (...args: any[]) => unknown;

  constructor(
    onFinish: (...args: any[]) => unknown,
    startImmediately: boolean,
    duration: number,
  ) {
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

  restart() {
    this.stop();
    this.start();
  }

  setTimer(duration = this.duration) {
    this.timerId = setTimeout(() => {
      this.onFinish();
    }, duration);
  }

  private hasTimePassed(): boolean {
    const timerTimeDiff = Date.now() - this.startTime!;
    return !!(this.duration && timerTimeDiff > this.duration);
  }

  private getTimeLeftAfterBackground() {
    return this.duration - (Date.now() - this.startTime!);
  }

  protected onBackground(): void {
    clearTimeout(this.timerId);
  }

  protected onForeground(): void {
    if (!this.startTime || !this.hasStarted) {
      return;
    }

    if (this.hasTimePassed()) {
      this.stop();
    } else {
      const timeLeft = this.getTimeLeftAfterBackground();

      this.setTimer(timeLeft);
    }
  }
}

export default AppTimer;
