import { QueryClient } from '@tanstack/react-query';

import { AppletWithVersion } from '@app/abstract/lib';
import { AppletDto, AppletsResponse } from '@app/shared/api';
import { getAppletsKey, getDataFromQuery } from '@app/shared/lib';

class RefreshOptimization {
  private keptVersions: Array<AppletWithVersion>;
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.keptVersions = [];
    this.queryClient = queryClient;
  }

  private getKeptVersion(appletId: string): string | null {
    return (
      this.keptVersions.find(x => x.appletId === appletId)?.version ?? null
    );
  }

  private getData(): AppletsResponse | null {
    return getDataFromQuery<AppletsResponse>(getAppletsKey(), this.queryClient);
  }

  public keepExistingAppletVersions() {
    const appletsResponse = this.getData();

    if (!appletsResponse) {
      this.keptVersions = [];
      return;
    }

    this.keptVersions = appletsResponse.result.map<AppletWithVersion>(x => ({
      appletId: x.id,
      version: x.version,
    }));
  }

  public shouldBeFullyUpdated(applet: AppletDto): boolean {
    const keptVersion = this.getKeptVersion(applet.id);
    return keptVersion === null || keptVersion !== applet.version;
  }
}

export default RefreshOptimization;
