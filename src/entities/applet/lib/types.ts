export type Applet = {
  id: string;
  image?: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
  } | null;
};
