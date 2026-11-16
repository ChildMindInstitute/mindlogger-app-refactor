import i18n from 'i18next';

import { setupLocalization } from './setupLocalization';

jest.mock('react-i18next', () => ({
  initReactI18next: { type: '3rdParty', init: jest.fn() },
}));

jest.mock('./localizationStorageInstance', () => ({
  getDefaultLocalizationStorage: () => ({ getLanguage: () => 'en' }),
}));

describe('setupLocalization', () => {
  beforeAll(async () => {
    await setupLocalization();
  });

  it('does not HTML-escape interpolated values (M2-11279)', () => {
    const flowStep = i18n.t('activity:flowStep', {
      activityPositionInFlow: 1,
      numberOfActivitiesInFlow: 6,
      activityFlowName: 'Parent/Caregiver Week 1 Survey',
    });
    expect(flowStep).toBe('(1 of 6) Parent/Caregiver Week 1 Survey');
    expect(flowStep).not.toBe('(1 of 6) Parent&#x2F;Caregiver Week 1 Survey');
  });
});
