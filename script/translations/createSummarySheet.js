const { utils } = require('xlsx');

function createSummarySheet(summary) {
  const rows = [
    ['Language', 'File', 'Missing', 'Empty', 'Same as English', 'Total'],
    ...summary.map(({ language, file, missing, empty, same, total }) => [
      language,
      file,
      missing,
      empty,
      same,
      total,
    ]),
  ];
  const sheet = utils.aoa_to_sheet(rows);
  sheet['!cols'] = [18, 28, 12, 12, 22, 12].map(wch => ({ wch }));
  utils.sheet_add_aoa(
    sheet,
    [
      [],
      [
        'Use the Language column filter on each category sheet to select a language.',
      ],
      ['Missing: no usable string translation exists for an English key.'],
      ['Empty: the translation is blank or contains only whitespace.'],
      ['Same as English: review each match; some matches are intentional.'],
      ['Use this report to update the translation files supplied separately.'],
    ],
    { origin: -1 },
  );

  return sheet;
}

module.exports = { createSummarySheet };
