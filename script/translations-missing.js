const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

// Node 24 (the project's required version) can load this TypeScript helper directly.
const {
  flattenTranslationStrings,
  validateTranslations,
} = require('../src/entities/localization/lib/validateTranslations.ts');

const labels = {
  'missing-key': 'MISSING',
  'empty-value': 'EMPTY',
  'same-as-reference': 'SAME AS ENGLISH',
};

function reportMissingTranslations() {
  const directory = path.join(__dirname, '../assets/translations');
  const files = readdirSync(directory)
    .filter(file => file.endsWith('.json') && file !== 'en.json')
    .sort();
  const readTranslation = file =>
    JSON.parse(readFileSync(path.join(directory, file), 'utf8'));
  const resources = {
    en: readTranslation('en.json'),
    ...Object.fromEntries(
      files.map(file => [path.basename(file, '.json'), readTranslation(file)]),
    ),
  };
  const english = flattenTranslationStrings(resources.en);
  const findings = validateTranslations(resources, 'en').filter(
    finding => finding.type !== 'malformed-list',
  );
  const summaries = [];

  console.log(`Comparing ${files.length} languages against en.json\n`);
  console.log(
    'Identical text may be intentional (for example, language names); review each match.\n',
  );

  for (const file of files) {
    const language = path.basename(file, '.json');
    const current = findings.filter(finding => finding.language === language);
    console.log(`${language} (${file})`);

    for (const type of Object.keys(labels)) {
      for (const finding of current.filter(item => item.type === type)) {
        console.log(`  ${labels[type]}  ${finding.key}`);
        console.log(`    English: ${JSON.stringify(english.get(finding.key))}`);
      }
    }

    const counts = Object.keys(labels).map(
      type => current.filter(finding => finding.type === type).length,
    );
    const summary = `${language}: ${counts[0]} missing, ${counts[1]} empty, ${counts[2]} same as English`;
    summaries.push(summary);
    console.log(`  ${summary}\n`);
  }

  console.log('Summary');
  for (const summary of summaries) console.log(`  ${summary}`);
  console.log(`\n${findings.length} findings. No translation files were changed.`);
}

try {
  reportMissingTranslations();
} catch (error) {
  console.error(`Unable to check translations: ${error.message}`);
  process.exitCode = 1;
}
