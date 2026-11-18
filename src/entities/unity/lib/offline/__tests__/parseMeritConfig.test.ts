import { readFileSync } from 'fs';
import { join } from 'path';

import { parseMeritConfig } from '../parseMeritConfig';

// A small config in the same format Unity exports, header line included.
const miniConfig = readFileSync(
  join(__dirname, 'fixtures/miniMeritConfig.txt'),
  'utf8',
);

describe('parseMeritConfig', () => {
  it('returns one entry per file in the config', () => {
    expect(parseMeritConfig(miniConfig)).toEqual([
      // Fix: one image.
      {
        resourceSetType: 1,
        resourceSetName: 'Fix',
        resourceName: 'Cross',
        kind: 'image',
        url: 'https://example.com/cross.png',
      },
      // Maske: image and audio become two entries.
      {
        resourceSetType: 4,
        resourceSetName: 'Maske',
        resourceName: 'Dots',
        kind: 'image',
        url: 'https://example.com/dots.png',
      },
      {
        resourceSetType: 4,
        resourceSetName: 'Maske',
        resourceName: 'Dots',
        kind: 'audio',
        url: 'https://example.com/beep.mp3',
      },
      // ComCrit: blank audio URL is skipped, so only the image.
      {
        resourceSetType: 3,
        resourceSetName: 'ComCrit',
        resourceName: 'Right',
        kind: 'image',
        url: 'https://example.com/right.png',
      },
    ]);
  });

  it('skips links to references that do not exist', () => {
    const config = JSON.stringify({
      m_TaskData: {
        m_task2d: {
          m_listResourceSets: [
            {
              getName: 'Fix',
              m_resourceType: 1,
              m_listResourceSetRoots: [{ fixationRes: { rid: 999 } }],
            },
          ],
        },
      },
      references: { RefIds: [] },
    });

    expect(parseMeritConfig(config)).toEqual([]);
  });

  it('returns an empty list when the config has no resource sets', () => {
    expect(parseMeritConfig('{}')).toEqual([]);
  });

  it('throws when there is no JSON in the input', () => {
    expect(() => parseMeritConfig('not a config')).toThrow(
      'No JSON object found',
    );
  });

  it('throws on malformed JSON', () => {
    expect(() => parseMeritConfig('{ "m_TaskData": ')).toThrow();
  });
});
