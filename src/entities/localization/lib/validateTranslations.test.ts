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
});
