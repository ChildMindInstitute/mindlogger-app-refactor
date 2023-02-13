import { AppletId } from '@app/shared/lib';

export type Applet = {
  id: AppletId;
  image?: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
  } | null;
};
