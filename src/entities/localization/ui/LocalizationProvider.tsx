import { PropsWithChildren, useEffect } from 'react';

import i18next from 'i18next';

import { Language } from '@app/shared/lib/types/language';

import { getDefaultLocalizationStorage } from '../lib/localizationStorageInstance';

type Props = PropsWithChildren;

export function LocalizationProvider({ children }: Props) {
  useEffect(() => {
    function onLanguageChange(language: Language) {
      getDefaultLocalizationStorage().setLanguage(language);
    }

    i18next.on('languageChanged', onLanguageChange);

    return () => {
      i18next.off('languageChanged', onLanguageChange);
    };
  }, []);

  return <>{children}</>;
}
