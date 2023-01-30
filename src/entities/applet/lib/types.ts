export type Applet = {
  id: number;
  image?: string;
  displayName: string;
  description: string;
  numberOverdue?: number;

  theme?: {
    logo?: string;
    smallLogo?: string;
  } | null;
};
