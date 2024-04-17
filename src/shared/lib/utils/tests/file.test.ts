import { isLocalFileUrl, getFilePath, getLocalFileUri } from '../file';

const setPlatform = (platform: 'ios' | 'android') => {
  jest.mock('react-native/Libraries/Utilities/Platform', () => {
    const Platform = jest.requireActual(
      'react-native/Libraries/Utilities/Platform',
    );

    Platform.OS = platform;

    return Platform;
  });
};

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
    'document.pdf',
    '/path/document.pdf',
    '/path/to/document.pdf',
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

describe('Test getLocalFileUri function', () => {
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
      expect(getLocalFileUri(fileName)).toBe(expectedURIs[i]);
    });
  });
});
