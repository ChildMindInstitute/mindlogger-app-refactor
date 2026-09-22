import { isDataTabHidden } from './isDataTabHidden';

describe('isDataTabHidden', () => {
  it('Should return true when the flag contains the wildcard', () => {
    expect(isDataTabHidden(['*'], 'applet-1')).toBe(true);
  });

  it('Should return true when the flag contains the applet id', () => {
    expect(isDataTabHidden(['applet-1', 'applet-2'], 'applet-1')).toBe(true);
  });

  it('Should return false when the flag does not contain the applet id', () => {
    expect(isDataTabHidden(['applet-2', 'applet-3'], 'applet-1')).toBe(false);
  });

  it('Should return false when the flag is an empty array', () => {
    expect(isDataTabHidden([], 'applet-1')).toBe(false);
  });
});
