import {
  abTrailsInput,
  abTrailsOutput,
  abTrailsWrongInput,
  abTrailsWrongOutput,
  CSTInput,
  CSTOutput,
  drawingInput,
  drawingOutput,
  FlankerAndroidInput,
  FlankerAndroidInputWithEmptyDurationInput,
  FlankerAndroidInputWithEmptyDurationOutput,
  FlankerAndroidOutput,
  FlankerIOSInput,
  FlankerIOSOutput,
} from './streamEventMapper.input.mock.ts';
import { mapStreamEventToDto } from '../streamEventMapper.ts';

jest.mock('@shared/lib', () => {
  let IS_ANDROID = false;

  return {
    get IS_ANDROID() {
      return IS_ANDROID;
    },
    set IS_ANDROID(value) {
      IS_ANDROID = value;
    },
  };
});

describe('Pass survey mapStreamEventToDto', () => {
  it('Should return mapped result for AbTrails item Live event', () => {
    const result = mapStreamEventToDto(abTrailsInput);

    expect(result).toEqual(abTrailsOutput);
  });

  it('Should return mapped result for AbTrails item Live event for wrong input', () => {
    const result = mapStreamEventToDto(abTrailsWrongInput);

    expect(result).toEqual(abTrailsWrongOutput);
  });

  it('Should return mapped result for Drawing item Live event', () => {
    const result = mapStreamEventToDto(drawingInput);

    expect(result).toEqual(drawingOutput);
  });

  it('Should return mapped result for StabilityTracker item Live event', () => {
    const result = mapStreamEventToDto(CSTInput);

    expect(result).toEqual(CSTOutput);
  });

  it('Should return mapped result for Flanker android item Live event', () => {
    require('@shared/lib').IS_ANDROID = true;

    const result = mapStreamEventToDto(FlankerAndroidInput);

    expect(result).toEqual(FlankerAndroidOutput);
  });

  it('Should return mapped result for Flanker android item Live event with empty duration field', () => {
    require('@shared/lib').IS_ANDROID = true;

    const result = mapStreamEventToDto(
      FlankerAndroidInputWithEmptyDurationInput,
    );

    expect(result).toEqual(FlankerAndroidInputWithEmptyDurationOutput);
  });

  it('Should return mapped result for Flanker IOS item Live event', () => {
    require('@shared/lib').IS_ANDROID = false;

    const result = mapStreamEventToDto(FlankerIOSInput);

    expect(result).toEqual(FlankerIOSOutput);
  });

  it('Should return mapped result for Undefined item type', () => {
    const result = mapStreamEventToDto({
      // @ts-expect-error
      type: 'Undefined',
    });

    expect(result).toEqual({ type: 'Undefined' });
  });
});
