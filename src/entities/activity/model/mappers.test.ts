import { mapToActivity } from './mappers';
import {
  basicItemsMapperInput,
  basicItemsMapperOutput,
  itemsWithAdditionalTextInput,
  itemsWithAdditionalTextOutput,
  drawingItemInput,
  drawingItemOutput,
  abTrailsInput,
  abTrailsOutput,
  flankerInput,
  flankerOutput,
  CSTInput,
  CSTOutput,
} from './mappers.mock';

describe('activity mapToActivity tests', () => {
  it('should return mapped result for all basic items', async () => {
    const input = basicItemsMapperInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(basicItemsMapperOutput);
  });

  it('should return mapped result for items with additionalText', async () => {
    const input = itemsWithAdditionalTextInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(itemsWithAdditionalTextOutput);
  });

  it('should return mapped result for drawing items with different configurations', async () => {
    const input = drawingItemInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(drawingItemOutput);
  });

  it('should return mapped result for abTrails item', async () => {
    const input = abTrailsInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(abTrailsOutput);
  });

  it('should return mapped result for flanker item', async () => {
    const input = flankerInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(flankerOutput);
  });

  it('should return mapped result for stability tracker item', async () => {
    const input = CSTInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(CSTOutput);
  });
});
