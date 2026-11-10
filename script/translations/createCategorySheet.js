const { utils } = require('xlsx');

function getCurrentTranslation(translations, key) {
  const value = key
    .split('.')
    .reduce(
      (parent, part) =>
        parent && Object.prototype.hasOwnProperty.call(parent, part)
          ? parent[part]
          : undefined,
      translations,
    );

  return typeof value === 'string' ? value : (JSON.stringify(value) ?? '');
}

function createCategorySheet(type, targetsByLanguage, findings) {
  const rows = [
    [
      'Language',
      'File',
      'Translation key',
      'English text',
      'Current translation',
    ],
  ];
  for (const finding of findings.filter(item => item.type === type)) {
    const target = targetsByLanguage.get(finding.language);
    rows.push([
      finding.language,
      target.file,
      finding.key,
      finding.englishValue,
      getCurrentTranslation(target.translations, finding.key),
    ]);
  }

  const sheet = utils.aoa_to_sheet(rows);
  sheet['!cols'] = [18, 28, 50, 80, 80].map(wch => ({ wch }));
  sheet['!autofilter'] = { ref: sheet['!ref'] };

  return sheet;
}

module.exports = { createCategorySheet };
