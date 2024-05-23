import { InterimSubmitMutex, Logger } from '@app/shared/lib';

const PostponeDuration = 2000;

class InterimInActionPostponer {
  private action: () => void;

  private timeoutId: NodeJS.Timeout | null;

  constructor(actionToPostpone: () => void) {
    this.action = actionToPostpone;
    this.timeoutId = null;
  }

  private shouldBePostponed(): boolean {
    return InterimSubmitMutex.isBusy();
  }

  private postpone() {
    this.timeoutId = setTimeout(() => {
      this.try();
    }, PostponeDuration);
  }

  private try() {
    if (this.shouldBePostponed()) {
      Logger.log('[InterimInActionPostponer.try] Postponed');
      this.postpone();
    } else {
      this.action();
    }
  }

  public tryExecute() {
    this.try();
  }

  public reset() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

export default InterimInActionPostponer;
