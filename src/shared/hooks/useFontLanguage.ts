import { useTranslation } from 'react-i18next';

export const useFontLanguage = () => {
  const { i18n } = useTranslation();

  const fontLanguage = i18n.language === 'el' ? 'el' : 'default';

  return fontLanguage;
};
