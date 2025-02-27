import { useEffect, useState } from 'react';

import { FontLanguages } from '@tamagui/core';
import i18next from 'i18next';

export const useFontLanguage = () => {
  const [fontLanguage, setFontLanguage] = useState<FontLanguages | 'default'>(
    'default',
  );
  const appLanguage = i18next.language;

  useEffect(() => {
    setFontLanguage(appLanguage !== 'el' ? 'default' : 'el');
  }, [appLanguage]);

  return fontLanguage;
};
