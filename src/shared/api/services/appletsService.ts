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

function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function appletsService() {
  return {
    getApplets() {
      const applets = mockApplets.sort(() => 0.5 - Math.random());

      return wait(2000).then(() =>
        Promise.resolve({
          data: { applets },
        } as AxiosResponse<AppletsResponse>),
      );
    },
  };
}

export default appletsService();
