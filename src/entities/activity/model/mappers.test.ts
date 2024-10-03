import {
  abTrailsOutput,
  cstOutput,
  flankerOutput,
} from '@entities/activity/model/performanceTasks.output.mock';

import { mapToActivity } from './mappers';
import {
  stackedRadioInput,
  stackedCheckboxInput,
  stackedSliderInput,
  photoInput,
  audioPlayerWithAdditionalTextInput,
  videoInput,
  timeRangeInput,
  dateInput,
  drawingInput,
  audioInput,
  audioPlayerInput,
  geoLocationInput,
  messageInput,
  conditionalInput,
  timeInput,
  checkboxInput,
  numberSelectInput,
  sliderInput,
  textInput,
} from './mappers.input.mock';
import {
  stackedRadioOutput,
  stackedCheckboxOutput,
  stackedSliderOutput,
  photoOutput,
  audioPlayerWithAdditionalTextOutput,
  videoOutput,
  timeRangeOutput,
  dateOutput,
  drawingOutput,
  audioOutput,
  audioPlayerOutput,
  geolocationOutput,
  messageOutput,
  conditionalOutput,
  timeOutput,
  checkboxOutput,
  numberSelectOutput,
  sliderOutput,
  textOutput,
} from './mappers.output.mock';
import {
  abTrailsInput,
  cstInput,
  flankerInput,
} from './performanceTasks.input.mock';
import { ActivityDetails } from '../lib/types/activity';

const removeUnusedProperties = (
  activityDetails: ActivityDetails,
): ActivityDetails => {
  // @ts-expect-error
  delete activityDetails.scoresAndReports;
  // @ts-expect-error
  delete activityDetails.timer;

  return activityDetails;
};

describe('Activity mapToActivity tests', () => {
  it('Should return mapped result for stacked radio item', async () => {
    const input = stackedRadioInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(stackedRadioOutput);
  });
  it('Should return mapped result for stacked slider item', async () => {
    const input = stackedSliderInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(stackedSliderOutput);
  });

  it('Should return mapped result for text item', async () => {
    const input = textInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(textOutput);
  });

  it('Should return mapped result for stacked checkbox item', async () => {
    const input = stackedCheckboxInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(stackedCheckboxOutput);
  });

  it('Should return mapped result for photo item', async () => {
    const input = photoInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(photoOutput);
  });

  it('Should return mapped result for video item', async () => {
    const input = videoInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(videoOutput);
  });

  it('Should return mapped result for timeRange item', async () => {
    const input = timeRangeInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(timeRangeOutput);
  });

  it('Should return mapped result for date item', async () => {
    const input = dateInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(dateOutput);
  });

  it('Should return mapped result for drawing item', async () => {
    const input = drawingInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(drawingOutput);
  });

  it('Should return mapped result for audio item', async () => {
    const input = audioInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(audioOutput);
  });

  it('Should return mapped result for geolocation item', async () => {
    const input = geoLocationInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(geolocationOutput);
  });

  it('Should return mapped result for audioPlayer item', async () => {
    const input = audioPlayerInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(audioPlayerOutput);
  });

  it('Should return mapped result for message item', async () => {
    const input = messageInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(messageOutput);
  });

  it('Should return mapped result for time item', async () => {
    const input = timeInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(timeOutput);
  });

  it('Should return mapped result for checkbox item', async () => {
    const input = checkboxInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(checkboxOutput);
  });

  it('Should return mapped result for NumberSelect item', async () => {
    const input = numberSelectInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(numberSelectOutput);
  });

  it('Should return mapped result for Slider item', async () => {
    const input = sliderInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(sliderOutput);
  });

  it('should return mapped result for items with additionalText', async () => {
    const input = audioPlayerWithAdditionalTextInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(
      audioPlayerWithAdditionalTextOutput,
    );
  });

  it('should return mapped result for conditional', async () => {
    const input = conditionalInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(conditionalOutput);
  });

  it('should return mapped result for AbTrails item', async () => {
    const input = abTrailsInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(abTrailsOutput);
  });

  it('should return mapped result for Stability tracker item', async () => {
    const input = cstInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(cstOutput);
  });

  it('should return mapped result for Flanker item', async () => {
    const input = flankerInput;

    const result = mapToActivity(input);

    expect(removeUnusedProperties(result)).toEqual(flankerOutput);
  });
});
