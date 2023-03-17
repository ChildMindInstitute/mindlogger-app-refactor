import { ThemeDto } from '@app/shared/api/services/themeService';

import { AppletThemes } from '../lib';

export function mapThemeDTOs(themeDTOs: ThemeDto[]) {
  return themeDTOs.reduce<AppletThemes>((themes, theme) => {
    return {
      ...themes,
      [theme.id]: theme,
    };
  }, {});
}
