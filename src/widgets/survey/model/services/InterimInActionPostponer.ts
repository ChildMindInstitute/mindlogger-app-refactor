import { ActionPostponer, InterimSubmitMutex } from '@app/shared/lib';

const PostponeDuration = 2000;

class InterimInActionPostponer extends ActionPostponer {
  private action: () => void;

  constructor(actionToPostpone: () => void) {
    super(PostponeDuration, 'InterimInActionPostponer');
    this.action = actionToPostpone;
  }

  protected callAction(): void {
    this.action();
  }

  protected shouldBePostponed(): boolean {
    return InterimSubmitMutex.isBusy();
  }

  protected resetAction(): void {}
}

export default InterimInActionPostponer;
