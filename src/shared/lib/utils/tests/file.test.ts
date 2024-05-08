import { setPlatform } from './testHelpers';
import {
  isLocalFileUrl,
  getFilePath,
  evaluateFileCacheUri,
  getFilenameFromLocalUri,
} from '../file';

describe('Test isLocalFileUrl function', () => {
  it('Should correctly identify file URLs', () => {
    const validFileUrls = [
      'file:///path/to/image.jpg',
      '/absolute/path/to/image.png',
      '/relative/path/to/video.mp4',
    ];

    validFileUrls.forEach(url => {
      expect(isLocalFileUrl(url)).toBe(true);
    });
  });

  it('Should correctly identify non-file URLs', () => {
    const invalidUrls = [
      'http://example.com/image.jpg',
      'https://example.com/video.mp4',
      '/path/to/document.pdf',
      'file://image.png', // Invalid due to missing slashes after "file:"
    ];

    invalidUrls.forEach(url => {
      expect(isLocalFileUrl(url)).toBe(false);
    });
  });
});

describe('Test getFilePath function', () => {
  const testPaths = [
    'document.pdf',
    '/path/document.pdf',
    '/path/to/document.pdf',
  ];

  const iosExpectedPaths = testPaths;

  const androidExpectedPaths = [
    'file://document.pdf',
    'file:///path/document.pdf',
    'file:///path/to/document.pdf',
  ];

  afterEach(() => {
    jest.resetModules();
  });

  it('Should return paths as-is on iOS', () => {
    setPlatform('ios');

    testPaths.forEach((path, i) => {
      expect(getFilePath(path)).toBe(iosExpectedPaths[i]);
    });
  });

  it('Should return paths with file:// prefix on Android', () => {
    setPlatform('android');

    testPaths.forEach((path, i) => {
      expect(getFilePath(path)).toBe(androidExpectedPaths[i]);
    });
  });
});

describe('Test evaluateFileCacheUri function', () => {
  const testFilesNames = [
    'audio.mp3',
    '7d7f7g6d8.mp4',
    '3f4g5h6j7o7-2g4h5k4-7d9f0d.svg',
  ];

  const expectedURIs = [
    'file:///mock/CacheDir/audio.mp3',
    'file:///mock/CacheDir/7d7f7g6d8.mp4',
    'file:///mock/CacheDir/3f4g5h6j7o7-2g4h5k4-7d9f0d.svg',
  ];

  it('Should return local URIs in the format: file://${CacheDir}/${fileName}', () => {
    testFilesNames.forEach((fileName, i) => {
      expect(evaluateFileCacheUri(fileName)).toBe(expectedURIs[i]);
    });
  });
});

describe('Test getFilenameFromLocalUri function', () => {
  it('Should return file name from local path', () => {
    const testCases = [
      'file:///document.pdf',
      'file:///path/image.jpg',
      'file:///path/to/video.mp4',
    ];

    const expectedResult = ['document.pdf', 'image.jpg', 'video.mp4'];

    testCases.forEach((testCase, i) => {
      expect(getFilenameFromLocalUri(testCase)).toBe(expectedResult[i]);
    });
  });

  it('Should return an empty string if a file does not have a local path', () => {
    const testCases = [
      'https://www.google.com/document.pdf',
      'image.jpg',
      'path/to/video.mp4',
    ];

    const expectedResult = '';

    testCases.forEach(testCase => {
      expect(getFilenameFromLocalUri(testCase)).toBe(expectedResult);
    });
  });
});
