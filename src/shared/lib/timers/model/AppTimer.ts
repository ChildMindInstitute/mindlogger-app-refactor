import TimerBase from './TimerBase';

class AppTimer extends TimerBase {
  private delay: number;

  constructor(
    delay: number,
    callback: Function,
    startImmediately: boolean,
    onFinish?: Function,
  ) {
    super(callback, startImmediately, onFinish);
    this.delay = delay;
  }

  execute() {
    this.timerId = setInterval(() => {
      this.callback();
    }, this.delay);
  }
}

export default AppTimer;
