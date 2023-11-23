import i18n from 'i18next';

import { DAYS_OF_WEEK_SHORT_NAMES } from '@shared/lib';

export const getWeekDaysWithLocale = () => {
  const { resolvedLanguage } = i18n;

  return DAYS_OF_WEEK_SHORT_NAMES[resolvedLanguage as 'fr' | 'en'];
};
