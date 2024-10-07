import { getDefaultInterimSubmitMutex } from '@app/shared/lib/mutexes/interimSubmitMutexInstance';
import { ActionPostponer } from '@app/shared/lib/services/ActionPostponer';

const PostponeDuration = 2000;

export class InterimInActionPostponer extends ActionPostponer {
  private action: () => void;

  constructor(actionToPostpone: () => void) {
    super(PostponeDuration, 'InterimInActionPostponer');
    this.action = actionToPostpone;
  }

  protected callAction(): void {
    this.action();
  }

  protected shouldBePostponed(): boolean {
    return getDefaultInterimSubmitMutex().isBusy();
  }

  protected resetAction(): void {}
}
