import { Logger } from '@shared/lib';

import {
  textInput,
  radioInput,
  checkboxInput,
  sliderInput,
  splashItem,
  dateInput,
  textAnswer,
  checkboxAnswer,
  radioAnswer,
  sliderAnswer,
  additionalAnswer,
  dateAnswer,
  numberSelectInput,
  numberSelectAnswer,
  timeInput,
  timeAnswer,
  timeRangeInput,
  timeRangeAnswer,
  geoInput,
  geoAnswer,
  stackedRadioInput,
  stackedRadioAnswer,
  stackedSliderInput,
  stackedSliderAnswer,
  videoInput,
  mediaAnswer,
  photoInput,
  audioInput,
  audioPlayerInput,
  audioPlayerAnswer,
  stackedCheckboxInput,
  stackedCheckboxAnswer,
  userActionsInput,
} from './mappers.input.mock';
import {
  textOutput,
  checkboxOutput,
  radioOutput,
  sliderOutput,
  additionalAnswerOutput,
  dateOutput,
  answersWithEmptyEntries,
  numberSelectOutput,
  timeOutput,
  timeRangeOutput,
  geoOutput,
  stackedRadioOutput,
  stackedSliderOutput,
  mediaOutput,
  audioPlayerOutput,
  stackedCheckboxOutput,
  userActionsOutput,
} from './mappers.output.mock';
import {
  drawingInput,
  drawingAnswer,
  CSTInput,
  CSTAnswer,
  ABTrailsInput,
  ABTrailsAnswer,
  FlankerInput,
  FlankerAnswers,
} from './performanceTasks.input.mock';
import {
  ABTrailsOutput,
  CSTOutput,
  drawingOutput,
  FlankerOutput,
} from './performanceTasks.output.mock';
import {
  mapAnswersToDto,
  mapAnswersToAlerts,
  mapUserActionsToDto,
} from '../mappers';

jest.mock('@app/shared/lib', () => {
  const mockedLib = jest.requireActual('@app/shared/lib');

  return {
    ...mockedLib,
    Logger: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    },
  };
});

describe('Survey widget mapAnswersToDto tests', () => {
  it('Should return mapped result for different items pipeline', () => {
    const pipeline = [
      textInput,
      radioInput,
      checkboxInput,
      sliderInput,
      dateInput,
      numberSelectInput,
      timeInput,
      timeRangeInput,
      geoInput,
      stackedRadioInput,
      stackedSliderInput,
      stackedCheckboxInput,
      drawingInput,
      CSTInput,
      ABTrailsInput,
    ];

    const answers = {
      0: textAnswer,
      1: radioAnswer,
      2: checkboxAnswer,
      3: sliderAnswer,
      4: dateAnswer,
      5: numberSelectAnswer,
      6: timeAnswer,
      7: timeRangeAnswer,
      8: geoAnswer,
      9: stackedRadioAnswer,
      10: stackedSliderAnswer,
      11: stackedCheckboxAnswer,
      12: drawingAnswer,
      13: CSTAnswer,
      14: ABTrailsAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(expect.arrayContaining(textOutput));
    expect(result).toEqual(expect.arrayContaining(radioOutput));
    expect(result).toEqual(expect.arrayContaining(checkboxOutput));
    expect(result).toEqual(expect.arrayContaining(sliderOutput));
    expect(result).toEqual(expect.arrayContaining(dateOutput));
    expect(result).toEqual(expect.arrayContaining(numberSelectOutput));
    expect(result).toEqual(expect.arrayContaining(timeOutput));
    expect(result).toEqual(expect.arrayContaining(timeRangeOutput));
    expect(result).toEqual(expect.arrayContaining(geoOutput));
    expect(result).toEqual(expect.arrayContaining(stackedRadioOutput));
    expect(result).toEqual(expect.arrayContaining(stackedSliderOutput));
    expect(result).toEqual(expect.arrayContaining(stackedCheckboxOutput));
    expect(result).toEqual(expect.arrayContaining(drawingOutput));
    expect(result).toEqual(expect.arrayContaining(CSTOutput));
    expect(result).toEqual(expect.arrayContaining(ABTrailsOutput));
  });

  it('Should return mapped result for undefined item', async () => {
    const pipeline = [
      {
        type: 'undefined',
      },
    ];

    const answers = {
      0: textAnswer,
    };

    // @ts-expect-error
    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual([null]);
  });

  it('Should return mapped result for textInput item', async () => {
    const pipeline = [textInput];
    const answers = {
      0: textAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(textOutput);
  });

  it('Should return mapped result for numberSelect item', async () => {
    const pipeline = [numberSelectInput];
    const answers = {
      0: numberSelectAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(numberSelectOutput);
  });

  it('Should return empty result for splash item', async () => {
    const pipeline = [textInput, splashItem];
    const answers = {
      0: textAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(textOutput);
  });

  it('Should return empty result for items without answer', async () => {
    const pipeline = [
      textInput,
      checkboxInput,
      radioInput,
      sliderInput,
      dateInput,
    ];
    const answers = {
      0: textAnswer,
      1: {
        answer: null,
      },
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(answersWithEmptyEntries);
  });

  it('Should return mapped result for item with additionalAnswer', async () => {
    const pipeline = [radioInput];
    const answers = {
      0: additionalAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(additionalAnswerOutput);
  });

  it('Should return mapped result for checkbox item', async () => {
    const pipeline = [checkboxInput];
    const answers = {
      0: checkboxAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(checkboxOutput);
  });

  it('Should return mapped result for radio item', async () => {
    const pipeline = [radioInput];
    const answers = {
      0: radioAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(radioOutput);
  });

  it('Should return mapped result for slider item', async () => {
    const pipeline = [sliderInput];
    const answers = {
      0: sliderAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(sliderOutput);
  });

  it('Should return mapped result for date item', async () => {
    const pipeline = [dateInput];
    const answers = {
      0: dateAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(dateOutput);
  });

  it('Should return mapped result for time item', async () => {
    const pipeline = [timeInput];
    const answers = {
      0: timeAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(timeOutput);
  });

  it('Should return mapped result for timeRange item', async () => {
    const pipeline = [timeRangeInput];
    const answers = {
      0: timeRangeAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(timeRangeOutput);
  });

  it('Should return mapped result for geolocation item', async () => {
    const pipeline = [geoInput];
    const answers = {
      0: geoAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(geoOutput);
  });

  it('Should return mapped result for stackedRadio item', async () => {
    const pipeline = [stackedRadioInput];
    const answers = {
      0: stackedRadioAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(stackedRadioOutput);
  });

  it('Should return mapped result for stackedSlider item', async () => {
    const pipeline = [stackedSliderInput];
    const answers = {
      0: stackedSliderAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(stackedSliderOutput);
  });

  it('Should return mapped result for stackedCheckbox item', async () => {
    const pipeline = [stackedCheckboxInput];
    const answers = {
      0: stackedCheckboxAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(stackedCheckboxOutput);
  });

  it('Should return mapped result for video item', async () => {
    const pipeline = [videoInput];
    const answers = {
      0: mediaAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(mediaOutput);
  });

  it('Should return mapped result for photo item', async () => {
    const pipeline = [photoInput];
    const answers = {
      0: mediaAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(mediaOutput);
  });

  it('Should return mapped result for audio item', async () => {
    const pipeline = [audioInput];
    const answers = {
      0: mediaAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(mediaOutput);
  });

  it('Should return mapped result for audioPlayer item', async () => {
    const pipeline = [audioPlayerInput];
    const answers = {
      0: audioPlayerAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(audioPlayerOutput);
  });

  it('Should return mapped result for drawing item', async () => {
    const pipeline = [drawingInput];
    const answers = {
      0: drawingAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(drawingOutput);
  });

  it('Should return mapped result for Stability tracker item', async () => {
    const pipeline = [CSTInput];
    const answers = {
      0: CSTAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(CSTOutput);
  });

  it('Should return mapped result for ABTest item', async () => {
    const pipeline = [ABTrailsInput];
    const answers = {
      0: ABTrailsAnswer,
    };

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(ABTrailsOutput);
  });

  it('Should return mapped result for Flanker item', async () => {
    const pipeline = FlankerInput;
    const answers = FlankerAnswers;

    const result = mapAnswersToDto(pipeline, answers);

    expect(result).toEqual(FlankerOutput);
  });

  it('Should return mapped result for radio item with alerts', async () => {
    const pipeline = [radioInput];
    const answers = {
      0: radioAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'radio-alert',
      },
    ]);
  });

  it('Should return mapped result for checkbox item with alerts', async () => {
    const pipeline = [checkboxInput];
    const answers = {
      0: checkboxAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'checkbox-alert',
      },
    ]);
  });

  it('Should return mapped result for stacked radio item with alerts', async () => {
    const pipeline = [stackedRadioInput];
    const answers = {
      0: stackedRadioAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'stacked-radio-alert',
      },
    ]);
  });

  it('Should return mapped result for stacked checkbox item with alerts', async () => {
    const pipeline = [stackedCheckboxInput];
    const answers = {
      0: stackedCheckboxAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'stacked-checkbox-alert',
      },
    ]);
  });

  it('Should return mapped result for slider item with alerts', async () => {
    const pipeline = [sliderInput];
    const answers = {
      0: sliderAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'slider-alert',
      },
    ]);
  });

  it('Should return mapped result for stacked slider item with alerts', async () => {
    const pipeline = [stackedSliderInput, textInput];
    const answers = {
      0: stackedSliderAnswer,
      1: textAnswer,
    };

    const result = mapAnswersToAlerts(pipeline, answers);

    expect(result).toEqual([
      {
        message: 'stacked-slider-alert',
      },
    ]);
  });

  it('Should throw error for mapAnswersToAlerts with invalid arguments', async () => {
    const pipeline = null;
    const answers = {
      0: stackedSliderAnswer,
    };

    //@ts-ignore
    expect(() => mapAnswersToAlerts(pipeline, answers)).toThrow();
    expect(Logger.warn).toBeCalled();
  });

  it('Should return mapped result for userActions', async () => {
    const result = mapUserActionsToDto(userActionsInput);

    expect(result).toEqual(userActionsOutput);
  });
});
