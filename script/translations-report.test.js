const { spawnSync } = require('node:child_process');
const {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { read, utils } = require('xlsx');

const root = path.resolve(__dirname, '..');
let fixture;
let resources;

const english = {
  nested: {
    missing: 'Log in\n{{name}}',
    empty: 'Log out',
    whitespace: 'Cancel',
    same: 'Actions',
    translated: 'Welcome {{name}}',
    formula: '=SUM(A1:A2)',
  },
  count_one: 'One',
  count_other: 'Many',
};
const french = {
  nested: {
    empty: '',
    whitespace: ' \t',
    same: 'Actions',
    translated: 'Bienvenue {{name}}',
    formula: '=SUM(A1:A2)',
  },
  count_one: 'Un',
  count_other: 'Plusieurs',
  extra: 'Élément supplémentaire',
};
const spanish = {
  nested: {
    empty: '',
    whitespace: 'Cancelar',
    same: 'Actions',
    translated: 'Bienvenido {{name}}',
    formula: 'Suma',
  },
  count_one: 'Uno',
  count_other: 'Muchos',
};

const runReport = (...args) =>
  spawnSync(
    process.execPath,
    [path.join(fixture, 'script/translations-report.js'), ...args],
    {
      cwd: tmpdir(),
      encoding: 'utf8',
    },
  );

const outputFolders = () =>
  readdirSync(path.join(fixture, 'translation-reports')).map(name =>
    path.join(fixture, 'translation-reports', name),
  );

beforeEach(() => {
  fixture = mkdtempSync(path.join(tmpdir(), 'app-translation-report-test-'));
  for (const file of [
    'script/translations-report.js',
    'script/translations/loadTranslations.js',
    'script/translations/createTranslationWorkbook.js',
    'script/translations/createSummarySheet.js',
    'script/translations/createCategorySheet.js',
    'script/translations/saveTranslationWorkbook.js',
    'src/entities/localization/lib/validateTranslations.ts',
  ]) {
    const destination = path.join(fixture, file);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, readFileSync(path.join(root, file)));
  }
  symlinkSync(
    path.join(root, 'node_modules'),
    path.join(fixture, 'node_modules'),
    'dir',
  );
  resources = path.join(fixture, 'assets/translations');
  mkdirSync(resources, { recursive: true });
  for (const [language, data] of Object.entries({
    en: english,
    fr: french,
    es: spanish,
  })) {
    writeFileSync(
      path.join(resources, `${language}.json`),
      `${JSON.stringify(data, null, 2)}\n`,
    );
  }
  writeFileSync(
    path.join(resources, 'unrelated.txt'),
    'not a translation file',
  );
});

afterEach(() => {
  rmSync(fixture, { recursive: true, force: true });
});

describe('translation report export', () => {
  it('exports only an Excel workbook covering all categories without changing sources', () => {
    const before = Object.fromEntries(
      readdirSync(resources).map(file => [
        file,
        readFileSync(path.join(resources, file), 'utf8'),
      ]),
    );
    const result = runReport();
    expect({ status: result.status, stderr: result.stderr }).toEqual({
      status: 0,
      stderr: '',
    });
    const [output] = outputFolders();
    expect(readdirSync(output)).toEqual(['translations-report.xlsx']);
    for (const [file, content] of Object.entries(before)) {
      expect(readFileSync(path.join(resources, file), 'utf8')).toBe(content);
    }

    const workbook = read(
      readFileSync(path.join(output, 'translations-report.xlsx')),
    );
    expect(workbook.SheetNames).toEqual([
      'Summary',
      'Missing',
      'Empty',
      'Same as English',
    ]);
    const rows = name =>
      utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: '' });
    expect(rows('Summary').slice(0, 3)).toEqual([
      ['Language', 'File', 'Missing', 'Empty', 'Same as English', 'Total'],
      ['es', 'es.json', 1, 1, 1, 3],
      ['fr', 'fr.json', 1, 2, 2, 5],
    ]);
    const header = [
      'Language',
      'File',
      'Translation key',
      'English text',
      'Current translation',
    ];
    expect(rows('Missing')).toEqual([
      header,
      ['es', 'es.json', 'nested.missing', 'Log in\n{{name}}', ''],
      ['fr', 'fr.json', 'nested.missing', 'Log in\n{{name}}', ''],
    ]);
    expect(rows('Empty')).toEqual([
      header,
      ['es', 'es.json', 'nested.empty', 'Log out', ''],
      ['fr', 'fr.json', 'nested.empty', 'Log out', ''],
      ['fr', 'fr.json', 'nested.whitespace', 'Cancel', ' \t'],
    ]);
    expect(rows('Same as English')).toEqual([
      header,
      ['es', 'es.json', 'nested.same', 'Actions', 'Actions'],
      ['fr', 'fr.json', 'nested.same', 'Actions', 'Actions'],
      ['fr', 'fr.json', 'nested.formula', '=SUM(A1:A2)', '=SUM(A1:A2)'],
    ]);
    expect(workbook.Sheets['Same as English'].D4.t).toBe('s');
    expect(workbook.Sheets['Same as English'].D4.f).toBeUndefined();
    for (const name of ['Missing', 'Empty', 'Same as English']) {
      const sheet = workbook.Sheets[name];
      expect(sheet.A1.v).toBe('Language');
      expect(sheet['!autofilter'].ref).toBe(`A1:E${rows(name).length}`);
    }
    expect(result.stdout).toContain(
      'fr: 1 missing, 2 empty, 2 same as English',
    );
    expect(result.stdout).toContain(
      path.join(output, 'translations-report.xlsx'),
    );
  });

  it('keeps category headers and language filters when there are no findings', () => {
    const translated = {
      ...spanish,
      nested: {
        ...spanish.nested,
        missing: 'Entrar',
        empty: 'Salir',
        same: 'Acciones',
      },
    };
    for (const language of ['es', 'fr']) {
      writeFileSync(
        path.join(resources, `${language}.json`),
        JSON.stringify(translated),
      );
    }
    const result = runReport();
    expect({ status: result.status, stderr: result.stderr }).toEqual({
      status: 0,
      stderr: '',
    });
    const [output] = outputFolders();
    const workbook = read(
      readFileSync(path.join(output, 'translations-report.xlsx')),
    );
    for (const name of ['Missing', 'Empty', 'Same as English']) {
      const sheet = workbook.Sheets[name];
      expect(utils.sheet_to_json(sheet, { header: 1 })).toEqual([
        [
          'Language',
          'File',
          'Translation key',
          'English text',
          'Current translation',
        ],
      ]);
      expect(sheet['!autofilter'].ref).toBe('A1:E1');
    }
    expect(result.stdout).toContain(
      'fr: 0 missing, 0 empty, 0 same as English',
    );
  });

  it('preserves earlier workbooks on repeated runs', () => {
    expect(runReport().status).toBe(0);
    const [first] = outputFolders();
    const firstWorkbook = readFileSync(
      path.join(first, 'translations-report.xlsx'),
    );
    writeFileSync(path.join(resources, 'fr.json'), '{}');
    expect(runReport().status).toBe(0);
    const folders = outputFolders();
    expect(folders).toHaveLength(2);
    expect(readFileSync(path.join(first, 'translations-report.xlsx'))).toEqual(
      firstWorkbook,
    );
    const second = folders.find(folder => folder !== first);
    expect(readdirSync(second)).toEqual(['translations-report.xlsx']);
    expect(
      readFileSync(path.join(second, 'translations-report.xlsx')),
    ).not.toEqual(firstWorkbook);
  });

  it.each(['{broken', 'null', '[]'])(
    'rejects invalid translation JSON %s before exporting',
    content => {
      writeFileSync(path.join(resources, 'fr.json'), content);
      const result = runReport();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Unable to generate translation report:');
      expect(existsSync(path.join(fixture, 'translation-reports'))).toBe(false);
    },
  );

  it('requires the English reference but never exports it', () => {
    rmSync(path.join(resources, 'en.json'));
    expect(runReport().status).toBe(1);
    expect(existsSync(path.join(fixture, 'translation-reports'))).toBe(false);
  });

  it('rejects the old category arguments', () => {
    const result = runReport('missing');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage: yarn translations:report');
    expect(existsSync(path.join(fixture, 'translation-reports'))).toBe(false);
  });

  it('leaves malformed calendar lists to the existing validation tests', () => {
    for (const [language, days] of Object.entries({
      en: 'Mon_Tue',
      fr: 'Lun',
      es: 'Lunes_Martes',
    })) {
      writeFileSync(
        path.join(resources, `${language}.json`),
        JSON.stringify({ days }),
      );
    }
    const result = runReport();
    expect({ status: result.status, stderr: result.stderr }).toEqual({
      status: 0,
      stderr: '',
    });
    const [output] = outputFolders();
    const workbook = read(
      readFileSync(path.join(output, 'translations-report.xlsx')),
    );
    expect(workbook.SheetNames).toEqual([
      'Summary',
      'Missing',
      'Empty',
      'Same as English',
    ]);
    expect(result.stdout).toContain(
      'fr: 0 missing, 0 empty, 0 same as English',
    );
  });
});
