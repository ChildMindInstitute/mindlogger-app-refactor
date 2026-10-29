const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

function loadTranslations(directory) {
  const readTranslation = file => {
    const translations = JSON.parse(
      readFileSync(path.join(directory, file), 'utf8'),
    );
    if (
      !translations ||
      typeof translations !== 'object' ||
      Array.isArray(translations)
    ) {
      throw new Error(`${file} must contain a translation object.`);
    }

    return translations;
  };
  const targets = readdirSync(directory)
    .filter(file => file.endsWith('.json') && file !== 'en.json')
    .sort()
    .map(file => ({
      file,
      language: path.basename(file, '.json'),
      translations: readTranslation(file),
    }));
  const resources = {
    en: readTranslation('en.json'),
    ...Object.fromEntries(
      targets.map(({ language, translations }) => [language, translations]),
    ),
  };

  return { targets, resources };
}

module.exports = { loadTranslations };
