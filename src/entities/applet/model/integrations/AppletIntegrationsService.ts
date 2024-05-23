import { AppletDetailsDto } from '@app/shared/api';
import { ILogger } from '@app/shared/lib';

import LorisAppletIntegration from './LorisAppletIntegration';

export interface IAppletIntegration {
  shouldBeIntegrated(applet: AppletDetailsDto): boolean;
  shouldBeDisintegrated(applet: AppletDetailsDto): boolean;
  applyIntegration(applet: AppletDetailsDto): void;
  removeIntegration(applet: AppletDetailsDto): void;
}

class AppletIntegrationsService {
  private integrations: IAppletIntegration[] = [];

  constructor(state: RootState, dispatch: AppDispatch, logger: ILogger) {
    this.integrations.push(new LorisAppletIntegration(state, dispatch, logger));
  }

  public applyIntegrations(applet: AppletDetailsDto): void {
    this.integrations.forEach(integration => {
      if (integration.shouldBeIntegrated(applet)) {
        integration.applyIntegration(applet);
      } else if (integration.shouldBeDisintegrated(applet)) {
        integration.removeIntegration(applet);
      }
    });
  }
}

export default AppletIntegrationsService;
