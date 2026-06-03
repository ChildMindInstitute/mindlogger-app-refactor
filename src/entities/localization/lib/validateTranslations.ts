type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type TranslationFinding =
  | { type: 'missing-key'; language: string; key: string }
  | {
      type: 'malformed-list';
      language: string;
      key: string;
      expectedSegments: number;
      actualSegments: number;
    };

// Lists are delimiter-separated strings (e.g. "Sun_Mon_Tue") where segment count matters.
const LIST_DELIMITER = '_';

const flattenStrings = (
  value: JsonValue,
  prefix: string,
  out: Map<string, string>,
) => {
  if (typeof value === 'string') {
    out.set(prefix, value);
    return;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      flattenStrings(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
};

// Reports keys missing in a language and list values whose segment count diverges from the reference.
export const validateTranslations = (
  resources: Record<string, JsonValue>,
  referenceLanguage: string,
): TranslationFinding[] => {
  const findings: TranslationFinding[] = [];

  const reference = new Map<string, string>();
  flattenStrings(resources[referenceLanguage], '', reference);

  for (const [language, tree] of Object.entries(resources)) {
    if (language === referenceLanguage) continue;

    const current = new Map<string, string>();
    flattenStrings(tree, '', current);

    for (const [key, referenceValue] of reference) {
      const value = current.get(key);

      if (value === undefined) {
        findings.push({ type: 'missing-key', language, key });
        continue;
      }

      if (referenceValue.includes(LIST_DELIMITER)) {
        const expectedSegments = referenceValue.split(LIST_DELIMITER).length;
        const actualSegments = value.split(LIST_DELIMITER).length;

        if (expectedSegments !== actualSegments) {
          findings.push({
            type: 'malformed-list',
            language,
            key,
            expectedSegments,
            actualSegments,
          });
        }
      }
    }
  }

  return findings;
};
