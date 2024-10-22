import { ILogger } from '@app/shared/lib/types/logger';

import { Answer } from '../../lib/hooks/useActivityStorageRecord';
import { PipelineItem } from '../../lib/types/payload';
import { AlertsExtractor } from '../AlertsExtractor';

const mockExtractFunctions = (extractor: AlertsExtractor) => {
  const extractFromRadioMock = jest.fn();
  const extractFromCheckboxMock = jest.fn();
  const extractFromStackedRadioMock = jest.fn();
  const extractFromStackedCheckboxMock = jest.fn();
  const extractFromSliderMock = jest.fn();
  const extractFromStackedSliderMock = jest.fn();

  extractor.extractFromCheckbox = extractFromCheckboxMock;
  extractor.extractFromRadio = extractFromRadioMock;
  extractor.extractFromSlider = extractFromSliderMock;
  extractor.extractFromStackedCheckbox = extractFromStackedCheckboxMock;
  extractor.extractFromStackedRadio = extractFromStackedRadioMock;
  extractor.extractFromStackedSlider = extractFromStackedSliderMock;
};

describe('AlertsExtractor: test extractFromItem', () => {
  let extractor: AlertsExtractor;

  beforeEach(() => {
    extractor = new AlertsExtractor({
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    } as unknown as ILogger);

    mockExtractFunctions(extractor);
  });

  it('Should call extractFromRadio when type is Radio', () => {
    //@ts-expect-error
    extractor.extractFromItem({ type: 'Radio' } as PipelineItem, {} as Answer);

    expect(extractor.extractFromRadio).toBeCalledTimes(1);
  });

  it('Should call extractFromCheckbox when type is Checkbox', () => {
    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'Checkbox' } as PipelineItem,
      {} as Answer,
    );

    expect(extractor.extractFromCheckbox).toBeCalledTimes(1);
  });

  it('Should call extractFromSlider when type is Slider', () => {
    //@ts-expect-error
    extractor.extractFromItem({ type: 'Slider' } as PipelineItem, {} as Answer);

    expect(extractor.extractFromSlider).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedRadio when type is StackedRadio', () => {
    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedRadio' } as PipelineItem,
      {} as Answer,
    );

    expect(extractor.extractFromStackedRadio).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedCheckbox when type is StackedCheckbox', () => {
    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedCheckbox' } as PipelineItem,
      {} as Answer,
    );

    expect(extractor.extractFromStackedCheckbox).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedSlider when type is StackedSlider', () => {
    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedSlider' } as PipelineItem,
      {} as Answer,
    );

    expect(extractor.extractFromStackedSlider).toBeCalledTimes(1);
  });

  it('Should not call anything when type is Audio', () => {
    //@ts-expect-error
    extractor.extractFromItem({ type: 'Audio' } as PipelineItem, {} as Answer);

    expect(extractor.extractFromRadio).toBeCalledTimes(0);
    expect(extractor.extractFromCheckbox).toBeCalledTimes(0);
    expect(extractor.extractFromStackedRadio).toBeCalledTimes(0);
    expect(extractor.extractFromStackedCheckbox).toBeCalledTimes(0);
    expect(extractor.extractFromSlider).toBeCalledTimes(0);
    expect(extractor.extractFromStackedSlider).toBeCalledTimes(0);
  });
});
