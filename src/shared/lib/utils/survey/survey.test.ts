import { invertColor } from './survey';
import { colors } from '../../constants';

describe('Function invertColor', () => {
  it('should return correct inverted color', () => {
    const hex = '#7FFFD4';

    const invertedColor = invertColor(hex);

    expect(invertedColor).toBe(colors.darkerGrey);
  });
});
