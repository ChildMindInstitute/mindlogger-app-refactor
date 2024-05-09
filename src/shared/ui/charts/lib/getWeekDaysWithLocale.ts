import i18n from 'i18next';

export const getWeekDaysWithLocale = () => {
  const DAYS_OF_WEEK_SHORT_NAMES = [
    i18n.t('activity_chart:monday'),
    i18n.t('activity_chart:tuesday'),
    i18n.t('activity_chart:wednesday'),
    i18n.t('activity_chart:thursday'),
    i18n.t('activity_chart:friday'),
    i18n.t('activity_chart:saturday'),
    i18n.t('activity_chart:sunday'),
  ];

  return DAYS_OF_WEEK_SHORT_NAMES;
};
