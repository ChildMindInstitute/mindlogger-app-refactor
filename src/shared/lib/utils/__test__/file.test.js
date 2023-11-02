import { isLocalFileUrl } from '../file';

describe('isFileUrl function', () => {
  it('should correctly identify file URLs', () => {
    const validFileUrls = [
      'file:///path/to/image.jpg',
      '/absolute/path/to/image.png',
      '/relative/path/to/video.mp4',
    ];

    validFileUrls.forEach(url => {
      expect(isLocalFileUrl(url)).toBe(true);
    });
  });

  it('should correctly identify non-file URLs', () => {
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
