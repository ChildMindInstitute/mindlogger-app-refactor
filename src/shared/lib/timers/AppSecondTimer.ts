import TimerBase from './TimerBase';

class AppSecondTimer extends TimerBase {
  onSecondPass: (...args: any[]) => unknown;
  onFinish: (...args: any[]) => unknown;
  duration: number;
  startTime: number;

  constructor(
    onSecondPass: (...args: any[]) => unknown,
    onFinish: (...args: any[]) => unknown,
    duration: number,
    startImmediately: boolean = false,
  ) {
    super(startImmediately);
    this.onSecondPass = onSecondPass;
    this.onFinish = onFinish;
    this.duration = duration;
    this.startTime = Date.now();
  }

  getTimeLeft(): number {
    return this.duration - (Date.now() - this.startTime!);
  }

  private isTimerFinished(): boolean {
    return this.getTimeLeft() > 0;
  }

  start(): void {
    super.start();
    this.setTimer();
  }

  setTimer() {
    this.timerId = setInterval(() => {
      if (this.isTimerFinished()) {
        this.onSecondPass(this.timerId);
      } else {
        this.onFinish();
        this.stop();
      }
    }, 1000);
  }

  stop() {
    super.stop();
    clearInterval(this.timerId);
  }

  onForeground(): void {
    if (this.hasStarted) {
      clearTimeout(this.timerId);
      this.setTimer();
    }
  }
}

export default AppSecondTimer;
