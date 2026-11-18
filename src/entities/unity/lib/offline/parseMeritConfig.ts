/**
 * Reads a MERIT task config and returns every image/audio file the task
 * needs, so the app can download them ahead of time for offline use.
 *
 * A set is a named group of resources of one type (e.g. "Crit" holds the Left
 * and Right arrow images). Each resource in a set is a root.
 *
 * Each root has one field per resource type. The field matching the set's
 * type links to a reference, and the reference holds the data. The other
 * fields are -2 (no link). Example for a Mask set:
 *
 *   {
 *     "m_TaskData": {
 *       "m_task2d": {
 *         "m_listResourceSets": [
 *           {
 *             "getName": "Maske",              // set name
 *             "m_resourceType": 4,             // set type (4 = Mask)
 *             "m_listResourceSetRoots": [
 *               {
 *                 "m_maskRes":       { "rid": 1003 },  // Mask set, so this one links to reference 1003
 *                 "instructionsRes": { "rid": -2 },    // set in an Instructions set
 *                 "fixationRes":     { "rid": -2 },    // set in a Fixation set
 *                 "criticalRes":     { "rid": -2 },    // set in a Critical Stimulus set
 *                 "compoundRes":     { "rid": -2 }     // set in a Compound Object set
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     },
 *     "references": {
 *       "RefIds": [
 *         {
 *           "rid": 1003,
 *           "data": {
 *             "m_sName": "0 New Mask",                  // resource name
 *             "m_sImageURL": "https://.../DotMask.png", // image to download
 *             "m_sAudioURL": "https://.../spell.mp3"    // audio to download
 *           }
 *         }
 *       ]
 *     }
 *   }
 */

// Unity's value for a field that doesn't link to anything.
const EMPTY_RID = -2;

export type MeritAssetKind = 'image' | 'audio';

// One file to download. A resource with both an image and an audio URL
// produces two of these, one per file.
export type MeritConfigAsset = {
  // The set's type (enum index on the Unity side, e.g. 4 = Mask).
  resourceSetType: number;
  // The set's name, e.g. "Maske".
  resourceSetName: string;
  // The resource's name, e.g. "0 New Mask".
  resourceName: string;
  kind: MeritAssetKind;
  // Remote URL to download from.
  url: string;
};

// Only the parts of the config we read. Everything else is ignored.
type RefId = {
  rid: number;
  data?: Record<string, unknown>;
};

type ResourceSet = {
  getName?: string;
  m_resourceType?: number;
  m_listResourceSetRoots?: Array<Record<string, unknown>>;
};

type MeritConfig = {
  m_TaskData?: { m_task2d?: { m_listResourceSets?: ResourceSet[] } };
  references?: { RefIds?: RefId[] };
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Unity writes "" for unused URL fields, so treat blank strings as missing.
const asNonEmptyString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value : null;

// Exported configs can start with a line of plain text (e.g. "New Task Data")
// before the JSON, which would make JSON.parse fail. Skip to the first "{".
const stripLeadingText = (raw: string): string => {
  const start = raw.indexOf('{');
  if (start === -1) {
    throw new Error('[parseMeritConfig] No JSON object found in config');
  }
  return raw.slice(start);
};

// Returns the reference ids a root links to, skipping the -2 fields. In
// practice a root has exactly one, but we don't rely on that.
const getRootRids = (root: Record<string, unknown>): number[] =>
  Object.values(root)
    .filter(isObject)
    .map(field => field.rid)
    .filter(
      (rid): rid is number => typeof rid === 'number' && rid !== EMPTY_RID,
    );

/**
 * Returns every downloadable file in the config, in the order the resource
 * sets list them. Throws if the config isn't valid JSON. A config with no
 * resource sets, or resources without URLs, returns an empty list.
 */
export const parseMeritConfig = (raw: string): MeritConfigAsset[] => {
  const config = JSON.parse(stripLeadingText(raw)) as MeritConfig;

  // Step 1: index the references by id so each link can find its data.
  const refsById = new Map<number, Record<string, unknown>>();
  for (const ref of config.references?.RefIds ?? []) {
    if (isObject(ref.data)) {
      refsById.set(ref.rid, ref.data);
    }
  }

  const sets = config.m_TaskData?.m_task2d?.m_listResourceSets ?? [];
  const assets: MeritConfigAsset[] = [];

  // Step 2: walk each set and each of its roots.
  for (const set of sets) {
    const resourceSetName = set.getName ?? '';
    const resourceSetType = set.m_resourceType ?? -1;

    for (const root of set.m_listResourceSetRoots ?? []) {
      // Step 3: follow the root's link to the reference data.
      for (const rid of getRootRids(root)) {
        const data = refsById.get(rid);
        if (!data) {
          // Link to a reference that doesn't exist: nothing to download.
          continue;
        }

        const resourceName = asNonEmptyString(data.m_sName) ?? '';
        const base = { resourceSetType, resourceSetName, resourceName };

        // Step 4: add one asset per URL. A resource can have an image, an
        // audio clip, or both.
        const imageUrl = asNonEmptyString(data.m_sImageURL);
        if (imageUrl) {
          assets.push({ ...base, kind: 'image', url: imageUrl });
        }

        const audioUrl = asNonEmptyString(data.m_sAudioURL);
        if (audioUrl) {
          assets.push({ ...base, kind: 'audio', url: audioUrl });
        }
      }
    }
  }

  return assets;
};
