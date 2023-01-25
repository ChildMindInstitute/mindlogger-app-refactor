export type Applet = {
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
