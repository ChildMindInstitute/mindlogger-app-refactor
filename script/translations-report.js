const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

// Node 24 (the project's required version) can load this TypeScript helper directly.
const {
  flattenTranslationStrings,
  validateTranslations,
} = require('../src/entities/localization/lib/validateTranslations.ts');

const reports = {
  missing: { type: 'missing-key', label: 'MISSING', description: 'missing' },
  empty: { type: 'empty-value', label: 'EMPTY', description: 'empty' },
  same: {
    type: 'same-as-reference',
    label: 'SAME AS ENGLISH',
    description: 'same as English',
  },
};

function reportTranslations() {
  const [category, ...extraArgs] = process.argv.slice(2);
  if (!Object.hasOwn(reports, category) || extraArgs.length > 0) {
    throw new Error(
      'Usage: node script/translations-report.js <missing|empty|same>',
    );
  }
  const report = reports[category];
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
    finding => finding.type === report.type,
  );
  const summaries = [];

  console.log(`Comparing ${files.length} languages against en.json\n`);
  console.log(`Showing ${report.description} translations only.\n`);
  if (category === 'same') {
    console.log(
      'Identical text may be intentional (for example, language names); review each match.\n',
    );
  }

  for (const file of files) {
    const language = path.basename(file, '.json');
    const current = findings.filter(finding => finding.language === language);
    console.log(`${language} (${file})`);

    for (const finding of current) {
      console.log(`  ${report.label}  ${finding.key}`);
      console.log(`    English: ${JSON.stringify(english.get(finding.key))}`);
    }

    const summary = `${language}: ${current.length} ${report.description}`;
    summaries.push(summary);
    console.log(`  ${summary}\n`);
  }

  console.log('Summary');
  for (const summary of summaries) console.log(`  ${summary}`);
  console.log(`\n${findings.length} findings. No translation files were changed.`);
}

try {
  reportTranslations();
} catch (error) {
  console.error(`Unable to check translations: ${error.message}`);
  process.exitCode = 1;
}
