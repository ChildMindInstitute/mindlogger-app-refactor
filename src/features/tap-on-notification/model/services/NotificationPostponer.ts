import { ActionPostponer } from '@app/shared/lib/services/ActionPostponer';

const PostponeDuration = 1000;

export class NotificationPostponer extends ActionPostponer {
  private _getCurrentRoute: (() => string | undefined) | null = null;

  private _action: (() => void) | null = null;

  constructor() {
    super(PostponeDuration, 'NotificationPostponer');
  }

  protected resetAction(): void {
    this._action = null;
  }

  protected callAction(): void {
    this._action!();
  }

  protected shouldBePostponed(): boolean {
    const isAutocompletionWorking =
      this._getCurrentRoute!() === 'Autocompletion';

    return isAutocompletionWorking;
  }

  public set getCurrentRoute(value: () => string | undefined) {
    this._getCurrentRoute = value;
  }

  public set action(value: () => void) {
    this._action = value;
  }
}
