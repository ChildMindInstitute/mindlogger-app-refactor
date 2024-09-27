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

describe('Pass survey mapStreamEventToDto', () => {
  let isAndroid: boolean;

  beforeEach(() => {
    isAndroid = false;
  });

  it('Should return mapped result for AbTrails item Live event', () => {
    const result = mapStreamEventToDto(abTrailsInput, { isAndroid });

    expect(result).toEqual(abTrailsOutput);
  });

  it('Should return mapped result for AbTrails item Live event for wrong input', () => {
    const result = mapStreamEventToDto(abTrailsWrongInput, { isAndroid });

    expect(result).toEqual(abTrailsWrongOutput);
  });

  it('Should return mapped result for Drawing item Live event', () => {
    const result = mapStreamEventToDto(drawingInput, { isAndroid });

    expect(result).toEqual(drawingOutput);
  });

  it('Should return mapped result for StabilityTracker item Live event', () => {
    const result = mapStreamEventToDto(CSTInput, { isAndroid });

    expect(result).toEqual(CSTOutput);
  });

  it('Should return mapped result for Flanker android item Live event', () => {
    isAndroid = true;

    const result = mapStreamEventToDto(FlankerAndroidInput, {
      isAndroid,
    });

    expect(result).toEqual(FlankerAndroidOutput);
  });

  it('Should return mapped result for Flanker android item Live event with empty duration field', () => {
    isAndroid = true;

    const result = mapStreamEventToDto(
      FlankerAndroidInputWithEmptyDurationInput,
      { isAndroid },
    );

    expect(result).toEqual(FlankerAndroidInputWithEmptyDurationOutput);
  });

  it('Should return mapped result for Flanker IOS item Live event', () => {
    const result = mapStreamEventToDto(FlankerIOSInput, { isAndroid });

    expect(result).toEqual(FlankerIOSOutput);
  });

  it('Should return mapped result for Undefined item type', () => {
    const result = mapStreamEventToDto({ type: 'Undefined' } as never, {
      isAndroid,
    });

    expect(result).toEqual({ type: 'Undefined' });
  });
});
