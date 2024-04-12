import { mapToActivity } from './mappers';
import {
  // itemsWithAdditionalTextInput,
  // itemsWithAdditionalTextOutput,
  // drawingItemInput,
  // drawingItemOutput,
  // abTrailsInput,
  // abTrailsOutput,
  // flankerInput,
  // flankerOutput,
  // CSTInput,
  // CSTOutput,
  // conditionalInput,
  // conditionalOutput,

  //
  stackedRadioOutput,
  stackedRadioInput,
  stackedCheckboxInput,
  stackedCheckboxOutput,
  stackedSliderInput,
  stackedSliderOutput,
} from './mappers.mock';

describe('Activity mapToActivity tests', () => {
  it('Should return mapped result for stacked radio item', async () => {
    const input = stackedRadioInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(stackedRadioOutput);
  });
  it('Should return mapped result for stacked slider item', async () => {
    const input = stackedSliderInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(stackedSliderOutput);
  });

  it('Should return mapped result for stacked checkbox item', async () => {
    const input = stackedCheckboxInput;

    // @ts-expect-error
    const result = mapToActivity(input);

    expect(result).toEqual(stackedCheckboxOutput);
  });
});
