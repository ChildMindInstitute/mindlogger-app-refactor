import { AxiosResponse } from 'axios';

import { mockApplets } from './mockApplets';

type AppletDto = {
  id: string;
  image?: string;
  name: string;
  description: string;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
    backgroundImage?: string;
    name?: string;
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
  } | null;
};

export type AppletsResponse = {
  applets: AppletDto[];
};

function appletsService() {
  return {
    getApplets() {
      return Promise.resolve({
        data: { applets: mockApplets },
      } as AxiosResponse<AppletsResponse>);
    },
  };
}

export default appletsService();
