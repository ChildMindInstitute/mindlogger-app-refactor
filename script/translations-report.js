const path = require('node:path');

const {
  createTranslationWorkbook,
} = require('./translations/createTranslationWorkbook.js');
const { loadTranslations } = require('./translations/loadTranslations.js');
const {
  saveTranslationWorkbook,
} = require('./translations/saveTranslationWorkbook.js');
// Node 24 (the project's required version) can load this TypeScript helper directly.
const {
  flattenTranslationStrings,
  validateTranslations,
} = require('../src/entities/localization/lib/validateTranslations.ts');

function reportTranslations() {
  if (process.argv.length !== 2) {
    throw new Error('Usage: yarn translations:report');
  }

  const root = path.resolve(__dirname, '..');
  const { targets, resources } = loadTranslations(
    path.join(root, 'assets/translations'),
  );
  const english = flattenTranslationStrings(resources.en);
  // Calendar-list validation remains in the existing tests, outside this translator report.
  const findings = validateTranslations(resources, 'en')
    .filter(finding => finding.type !== 'malformed-list')
    .map(finding => ({ ...finding, englishValue: english.get(finding.key) }));
  const { workbook, summary } = createTranslationWorkbook(targets, findings);
  const output = saveTranslationWorkbook(
    workbook,
    path.join(root, 'translation-reports'),
  );

  for (const { language, missing, empty, same } of summary) {
    console.log(
      `${language}: ${missing} missing, ${empty} empty, ${same} same as English`,
    );
  }
  console.log(`\nReport: ${output}`);
  console.log('Source translation files were not changed.');
}

try {
  reportTranslations();
} catch (error) {
  console.error(`Unable to generate translation report: ${error.message}`);
  process.exitCode = 1;
}
