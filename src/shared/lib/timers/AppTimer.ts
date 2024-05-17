import { TimerCallbackFeedback } from '@app/abstract/lib';

import TimerBase from './TimerBase';

const PostponeDuration = 2000;

class AppTimer extends TimerBase {
  private duration: number;
  private startTime?: number;
  private onFinish: (...args: any[]) => TimerCallbackFeedback;

  constructor(
    onFinish: (...args: any[]) => TimerCallbackFeedback,
    startImmediately: boolean,
    duration: number,
  ) {
    super();
    this.duration = duration;
    this.onFinish = onFinish;

    if (startImmediately) {
      this.start();
    }
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

  postpone(onSuccess?: () => void) {
    this.timerId = setTimeout(() => {
      const needPostpone: boolean = this.onFinish() === 'request-for-postpone';

      if (needPostpone) {
        this.postpone();
      } else if (onSuccess) {
        onSuccess();
      }
    }, PostponeDuration);
  }

  setTimer(duration = this.duration) {
    this.timerId = setTimeout(() => {
      const needPostpone: boolean = this.onFinish() === 'request-for-postpone';

      if (needPostpone) {
        this.postpone();
      }
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
      const needPostpone = this.onFinish() === 'request-for-postpone';

      if (needPostpone) {
        this.postpone(() => this.stop());
      } else {
        this.stop();
      }
    } else {
      const timeLeft = this.getTimeLeftAfterBackground();

      this.setTimer(timeLeft);
    }
  }
}

export default AppTimer;
