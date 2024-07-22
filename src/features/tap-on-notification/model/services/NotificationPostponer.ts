import { Logger } from '@app/shared/lib';

const PostponeDuration = 1000;

class NotificationPostponer {
  private timeoutId: NodeJS.Timeout | null;

  private _getCurrentRoute: (() => string | undefined) | null = null;

  private _action: (() => void) | null = null;

  constructor() {
    this.timeoutId = null;
  }

  private shouldBePostponed(): boolean {
    const isAutocompletionWorking =
      this._getCurrentRoute!() === 'Autocompletion';

    return isAutocompletionWorking;
  }

  private postpone() {
    this.timeoutId = setTimeout(() => {
      this.try();
    }, PostponeDuration);
  }

  private try(): boolean {
    if (this.shouldBePostponed()) {
      this.postpone();

      return false;
    } else {
      this._action!();

      return true;
    }
  }

  public set getCurrentRoute(value: () => string | undefined) {
    this._getCurrentRoute = value;
  }

  public set action(value: () => void) {
    this._action = value;
  }

  public tryExecute(): boolean {
    const success = this.try();

    if (!success) {
      Logger.log('[NotificationPostponer.try] Postponed');
    }

    return success;
  }

  public reset() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this._action = null;
  }
}

export default NotificationPostponer;
