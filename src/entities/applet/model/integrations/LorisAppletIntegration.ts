import { AppletDetailsDto } from '@app/shared/api';
import { ILogger, IS_LORIS_INTEGRATION_ENABLED } from '@app/shared/lib';

import { IAppletIntegration } from './AppletIntegrationsService';
import { selectAppletConsents } from '../selectors';
import { actions } from '../slice';

class LorisAppletIntegration implements IAppletIntegration {
  private logger: ILogger;
  private dispatch: AppDispatch;
  private state: RootState;

  constructor(state: RootState, dispatch: AppDispatch, logger: ILogger) {
    this.logger = logger;
    this.dispatch = dispatch;
    this.state = state;
  }

  private getAppletConsents(appletId: string) {
    return selectAppletConsents(this.state, appletId);
  }

  public shouldBeIntegrated(applet: AppletDetailsDto): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris');

    return !alreadyIntegrated && hasIntegration && IS_LORIS_INTEGRATION_ENABLED;
  }

  public shouldBeDisintegrated(applet: AppletDetailsDto): boolean {
    const alreadyIntegrated = !!this.getAppletConsents(applet.id);
    const hasIntegration = applet.integrations?.includes('loris');

    return alreadyIntegrated && !hasIntegration;
  }

  public applyIntegration(applet: AppletDetailsDto) {
    this.dispatch(actions.applyDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration of applet: ${applet.displayName}|${applet.id} completed successfully`,
    );
  }

  public removeIntegration(applet: AppletDetailsDto): void {
    this.dispatch(actions.removeDataSharingSettings({ appletId: applet.id }));
    this.logger.info(
      `[LorisAppletIntegration.applyIntegration] LORIS integration has been removed from applet: ${applet.displayName}|${applet.id}`,
    );
  }
}

export default LorisAppletIntegration;
