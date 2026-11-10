const { utils } = require('xlsx');

const { createCategorySheet } = require('./createCategorySheet.js');
const { createSummarySheet } = require('./createSummarySheet.js');

const categories = [
  { type: 'missing-key', title: 'Missing', field: 'missing' },
  { type: 'empty-value', title: 'Empty', field: 'empty' },
  { type: 'same-as-reference', title: 'Same as English', field: 'same' },
];

function createTranslationWorkbook(targets, findings) {
  const summary = targets.map(({ language, file }) => {
    const current = findings.filter(finding => finding.language === language);

    return {
      language,
      file,
      ...Object.fromEntries(
        categories.map(({ type, field }) => [
          field,
          current.filter(finding => finding.type === type).length,
        ]),
      ),
      total: current.length,
    };
  });
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, createSummarySheet(summary), 'Summary');
  const targetsByLanguage = new Map(
    targets.map(target => [target.language, target]),
  );
  for (const category of categories) {
    const sheet = createCategorySheet(
      category.type,
      targetsByLanguage,
      findings,
    );
    utils.book_append_sheet(workbook, sheet, category.title);
  }

  return { workbook, summary };
}

module.exports = { createTranslationWorkbook };
