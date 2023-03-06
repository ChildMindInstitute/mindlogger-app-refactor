export type Applet = {
  id: string;
  image?: string | null;
  displayName: string;
  description: string;
  numberOverdue?: number;
  themeId: string | null;
};

export type AppletTheme = {
  id: string;
  name: string;
  logo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
};

export type AppletThemes = Record<string, AppletTheme | undefined>;
