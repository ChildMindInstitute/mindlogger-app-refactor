import { PropsWithChildren, useEffect } from 'react';

import i18next from 'i18next';

import { Language } from '@app/shared/lib';

import { LocalizationStorage } from '../lib';

type Props = PropsWithChildren;

function LocalizationProvider({ children }: Props) {
  useEffect(() => {
    function onLanguageChange(language: Language) {
      LocalizationStorage.setLanguage(language);
    }

    i18next.on('languageChanged', onLanguageChange);

    return () => {
      i18next.off('languageChanged', onLanguageChange);
    };
  }, []);

  return <>{children}</>;
}

export default LocalizationProvider;
