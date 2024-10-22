import { getDefaultLogger } from './loggerInstance';

export class ActionPostponer {
  private timeoutId: NodeJS.Timeout | null;

  private postponeDuration: number;

  private logPostponerType: string;

  constructor(postponeDuration: number, logPostponerType: string) {
    this.timeoutId = null;
    this.postponeDuration = postponeDuration;
    this.logPostponerType = logPostponerType;
  }

  protected shouldBePostponed(): boolean {
    getDefaultLogger().warn(
      `[ActionPostponer.shouldBePostponed] The method should be called in the subclass' "${this.logPostponerType}" scope`,
    );
    return false;
  }

  protected callAction() {
    getDefaultLogger().warn(
      `[ActionPostponer.callAction] The method should be called in the subclass' "${this.logPostponerType}" scope`,
    );
  }

  protected resetAction() {
    getDefaultLogger().warn(
      `[ActionPostponer.resetAction] The method should be called in the subclass' "${this.logPostponerType}" scope`,
    );
  }

  private postpone() {
    this.timeoutId = setTimeout(() => {
      this.try();
    }, this.postponeDuration);
  }

  private try(): boolean {
    if (this.shouldBePostponed()) {
      this.postpone();

      return false;
    } else {
      this.callAction();

      return true;
    }
  }

  public tryExecute(): boolean {
    const success = this.try();

    if (!success) {
      getDefaultLogger().log(`[${this.logPostponerType}.tryExecute] Postponed`);
    } else {
      getDefaultLogger().log(
        `[${this.logPostponerType}.tryExecute] Success on the 1st try`,
      );
    }

    return success;
  }

  public reset() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);

      this.resetAction();
    }
  }
}
