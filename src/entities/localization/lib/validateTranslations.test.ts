import af from '@assets/translations/af.json';
import el from '@assets/translations/el.json';
import en from '@assets/translations/en.json';
import es from '@assets/translations/es.json';
import fr from '@assets/translations/fr.json';
import ptBr from '@assets/translations/pt.json';
import xh from '@assets/translations/xh.json';
import zu from '@assets/translations/zu.json';

import { validateTranslations } from './validateTranslations';

// Mirrors the resources registered in setupLocalization.
const resources = { en, fr, el, es, pt: ptBr, af, xh, zu };
const REFERENCE_LANGUAGE = 'en';

describe('translations', () => {
  // Malformed list values still resolve in i18next, so the fallback never triggers and consumers crash.
  it('has no list values that diverge from the English reference', () => {
    const malformed = validateTranslations(
      resources,
      REFERENCE_LANGUAGE,
    ).filter(finding => finding.type === 'malformed-list');

    expect(malformed).toEqual([]);
  });

  // A key present in the English reference but absent in another language is reported.
  it('reports keys missing from a non-reference language', () => {
    const findings = validateTranslations(
      {
        en: { greeting: 'Hello', farewell: 'Goodbye' },
        fr: { greeting: 'Bonjour' },
      },
      'en',
    );

    expect(findings).toEqual([
      { type: 'missing-key', language: 'fr', key: 'farewell' },
    ]);
  });

  it('distinguishes nested missing, blank, and exactly matching translations', () => {
    const findings = validateTranslations(
      {
        en: {
          buttons: {
            login: 'Log in',
            logout: 'Log out',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            back: 'Back',
            next: 'Next',
          },
        },
        fr: {
          buttons: {
            logout: '',
            save: 'Save',
            cancel: ' \t\n',
            confirm: 'Confirmer',
            back: 'back',
            next: 'Next ',
            extra: 'Extra',
          },
        },
        es: {},
      },
      'en',
    );

    expect(findings.filter(finding => finding.language === 'fr')).toEqual([
      { type: 'missing-key', language: 'fr', key: 'buttons.login' },
      { type: 'empty-value', language: 'fr', key: 'buttons.logout' },
      { type: 'same-as-reference', language: 'fr', key: 'buttons.save' },
      { type: 'empty-value', language: 'fr', key: 'buttons.cancel' },
    ]);
    expect(findings.filter(finding => finding.language === 'es')).toHaveLength(
      7,
    );
    expect(findings.some(finding => finding.language === 'en')).toBe(false);
  });
});
