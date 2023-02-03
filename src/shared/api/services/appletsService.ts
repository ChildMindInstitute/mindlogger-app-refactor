import { Language } from '@app/shared/lib';
import { AppletDetailsDto } from '@app/shared/lib/types';

import httpService from './httpService';

type AppletDto = {
  id: number;
  image?: string;
  displayName: string;
  description: Record<Language, string>;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
  } | null;
};

export type AppletsResponse = {
  result: AppletDto[];
};

type AppletDetailsRequest = {
  appletId: string;
};

export type AppletDetailsResponse = {
  result: AppletDetailsDto;
};

function appletsService() {
  return {
    getApplets() {
      return httpService.get<AppletsResponse>('/applets');
    },
    getAppletDetails(request: AppletDetailsRequest) {
      return httpService.get<AppletDetailsResponse>(
        `/applets/${request.appletId}`,
      );
    },
  };
}

export default appletsService();
