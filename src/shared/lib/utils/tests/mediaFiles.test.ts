import { FileSystem } from 'react-native-file-access';

import { setPlatform } from './testHelpers';
import {
  moveMediaFileToCache,
  preparePhotoFile,
  prepareVideoFile,
} from '../mediaFile';

jest.mock('../../services', () => ({
  Logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Test moveMediaFileToCache function', () => {
  const testCases = [
    { fileName: 'video.mp4', uri: '/path/to/media/video.mp4' },
    { fileName: 'audio.m4a', uri: '/path/to/media/audio.m4a' },
    { fileName: 'image.jpg', uri: '/path/to/media/image.jpg' },
  ];

  const expectedResult = [
    'file:///mock/CacheDir/video.mp4',
    'file:///mock/CacheDir/audio.m4a',
    'file:///mock/CacheDir/image.jpg',
  ];

  beforeAll(async () => {
    for await (const testCase of testCases) {
      await FileSystem.appendFile(testCase.uri, 'content');
    }
  });

  afterAll(async () => {
    for await (const testCase of testCases) {
      await FileSystem.unlink(testCase.uri);
    }
  });

  it('Should return appropriate path in File System', async () => {
    for await (const testCase of testCases) {
      const index = testCases.lastIndexOf(testCase);

      await expect(
        moveMediaFileToCache(testCase.fileName, testCase.uri),
      ).resolves.toBe(expectedResult[index]);
    }
  });
});

describe('Test preparePhotoFile function', () => {
  const iosTestCases = [
    {
      fileSize: 123,
      uri: 'file:///path/to/content/photo-1.jpg',
      type: 'image/jpg',
      fileName: 'photo-1.jpg',
    },
    {
      fileSize: 123,
      uri: 'file:///another/path/to/content/photo-2.png',
      type: 'image/png',
      fileName: 'photo-2.png',
    },
  ];

  const androidTestCases = [
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/photo-3.jpg',
      type: 'image/jpg',
      fileName: 'different-name-3.jpg',
    },
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/photo-4.png',
      type: 'image/png',
      fileName: 'different-name-4.png',
    },
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/photo-5.jpeg',
      type: 'image/jpeg',
      fileName: 'different-name-5.jpeg',
    },
  ];

  const testCases = [...iosTestCases, ...androidTestCases];

  beforeEach(async () => {
    for await (const testCase of testCases) {
      await FileSystem.appendFile(testCase.uri, 'content');
    }
  });

  afterEach(async () => {
    for await (const testCase of testCases) {
      await FileSystem.unlink(testCase.uri);
    }
  });

  it('Should return asset in an appropriate format and move file on iOS', async () => {
    setPlatform('ios');

    const expectedResult = [
      {
        size: 123,
        type: 'image/jpg',
        fileName: 'photo-1.jpg',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'image/png',
        fileName: 'photo-2.png',
        fromLibrary: true,
      },
    ];

    for await (const testCase of iosTestCases) {
      const index = iosTestCases.lastIndexOf(testCase);

      const expectedPath = `file:///mock/CacheDir/${testCase.fileName}`;

      await expect(preparePhotoFile(testCase, true)).resolves.toMatchObject(
        expectedResult[index],
      );

      await expect(FileSystem.exists(expectedPath)).resolves.toBe(true);
    }
  });

  it('Should return asset in an appropriate format and rename file on Android', async () => {
    setPlatform('android');

    const expectedResult = [
      {
        size: 123,
        type: 'image/jpg',
        fileName: 'photo-3.jpg',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'image/png',
        fileName: 'photo-4.png',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'image/jpeg',
        fileName: 'photo-5.jpeg',
        fromLibrary: true,
      },
    ];

    for await (const testCase of androidTestCases) {
      const index = androidTestCases.lastIndexOf(testCase);

      const expectedName = expectedResult[index].fileName;
      const expectedPath = `file:///mock/CacheDir/${expectedName}`;

      const photo = await preparePhotoFile(testCase, true);

      expect(photo).toMatchObject(expectedResult[index]);
      expect(photo.fileName).toBe(expectedName);

      await expect(FileSystem.exists(expectedPath)).resolves.toBe(true);
    }
  });
});

describe('Test prepareVideoFile function', () => {
  const iosTestCases = [
    {
      fileSize: 123,
      uri: 'file:///path/to/content/video-1.mov',
      type: 'video/quicktime',
      fileName: 'video-1.mov',
    },
    {
      fileSize: 123,
      uri: 'file:///another/path/to/content/video-2.mp4',
      type: 'video/mp4',
      fileName: 'video-2.mp4',
    },
  ];

  const androidTestCases = [
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/video-3.mp4',
      type: 'video/mp4',
      fileName: 'different-name-3.mp4',
    },
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/video-4.mp4',
      type: 'video/mp4',
      fileName: 'different-name-4.mp4',
    },
    {
      fileSize: 123,
      uri: 'file:///mock/CacheDir/video-5.mp4',
      type: 'video/mp4',
      fileName: 'different-name-5.mp4',
    },
  ];

  const testCases = [...iosTestCases, ...androidTestCases];

  beforeEach(async () => {
    for await (const testCase of testCases) {
      await FileSystem.appendFile(testCase.uri, 'content');
    }
  });

  afterEach(async () => {
    for await (const testCase of testCases) {
      await FileSystem.unlink(testCase.uri);
    }
  });

  it('Should return asset in an appropriate format and move file on iOS', async () => {
    setPlatform('ios');

    const expectedResult = [
      {
        size: 123,
        type: 'video/quicktime',
        fileName: 'video-1.mov',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'video/mp4',
        fileName: 'video-2.mp4',
        fromLibrary: true,
      },
    ];

    for await (const testCase of iosTestCases) {
      const index = iosTestCases.lastIndexOf(testCase);

      const expectedPath = `file:///mock/CacheDir/${testCase.fileName}`;

      await expect(preparePhotoFile(testCase, true)).resolves.toMatchObject(
        expectedResult[index],
      );

      await expect(FileSystem.exists(expectedPath)).resolves.toBe(true);
    }
  });

  it('Should return asset in an appropriate format and rename file on Android', async () => {
    setPlatform('android');

    const expectedResult = [
      {
        size: 123,
        type: 'video/mp4',
        fileName: 'video-3.mp4',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'video/mp4',
        fileName: 'video-4.mp4',
        fromLibrary: true,
      },
      {
        size: 123,
        type: 'video/mp4',
        fileName: 'video-5.mp4',
        fromLibrary: true,
      },
    ];

    for await (const testCase of androidTestCases) {
      const index = androidTestCases.lastIndexOf(testCase);

      const expectedName = expectedResult[index].fileName;
      const expectedPath = `file:///mock/CacheDir/${expectedName}`;

      const photo = await prepareVideoFile(testCase, true);

      expect(photo).toMatchObject(expectedResult[index]);
      expect(photo.fileName).toBe(expectedName);

      await expect(FileSystem.exists(expectedPath)).resolves.toBe(true);
    }
  });
});
