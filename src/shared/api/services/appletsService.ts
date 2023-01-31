import { Language } from '@app/shared/lib';

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
  results: AppletDto[];
};

function appletsService() {
  return {
    getApplets() {
      return httpService.get<AppletsResponse>('/applets');
    },
  };
}

export default appletsService();
