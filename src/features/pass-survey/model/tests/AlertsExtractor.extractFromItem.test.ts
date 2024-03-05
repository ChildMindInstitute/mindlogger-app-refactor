import { ILogger } from '@app/shared/lib';

import { Answer, PipelineItem } from '../../lib';
import { AlertsExtractor } from '../AlertsExtractor';

jest.mock('@app/shared/lib/constants', () => ({
  ...jest.requireActual('@app/shared/lib/constants'),
  STORE_ENCRYPTION_KEY: '12345',
}));

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

  return {
    extractFromRadioMock,
    extractFromCheckboxMock,
    extractFromStackedRadioMock,
    extractFromStackedCheckboxMock,
    extractFromSliderMock,
    extractFromStackedSliderMock,
  };
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
  });

  it('Should call extractFromRadio when type is Radio', () => {
    const { extractFromRadioMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem({ type: 'Radio' } as PipelineItem, {} as Answer);

    expect(extractFromRadioMock).toBeCalledTimes(1);
  });

  it('Should call extractFromCheckbox when type is Checkbox', () => {
    const { extractFromCheckboxMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'Checkbox' } as PipelineItem,
      {} as Answer,
    );

    expect(extractFromCheckboxMock).toBeCalledTimes(1);
  });

  it('Should call extractFromSlider when type is Slider', () => {
    const { extractFromSliderMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem({ type: 'Slider' } as PipelineItem, {} as Answer);

    expect(extractFromSliderMock).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedRadio when type is StackedRadio', () => {
    const { extractFromStackedRadioMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedRadio' } as PipelineItem,
      {} as Answer,
    );

    expect(extractFromStackedRadioMock).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedCheckbox when type is StackedCheckbox', () => {
    const { extractFromStackedCheckboxMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedCheckbox' } as PipelineItem,
      {} as Answer,
    );

    expect(extractFromStackedCheckboxMock).toBeCalledTimes(1);
  });

  it('Should call extractFromStackedSlider when type is StackedSlider', () => {
    const { extractFromStackedSliderMock } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem(
      { type: 'StackedSlider' } as PipelineItem,
      {} as Answer,
    );

    expect(extractFromStackedSliderMock).toBeCalledTimes(1);
  });

  it('Should not call anything when type is Audio', () => {
    const {
      extractFromRadioMock,
      extractFromCheckboxMock,
      extractFromStackedRadioMock,
      extractFromStackedCheckboxMock,
      extractFromSliderMock,
      extractFromStackedSliderMock,
    } = mockExtractFunctions(extractor);

    //@ts-expect-error
    extractor.extractFromItem({ type: 'Audio' } as PipelineItem, {} as Answer);

    expect(extractFromRadioMock).toBeCalledTimes(0);
    expect(extractFromCheckboxMock).toBeCalledTimes(0);
    expect(extractFromStackedRadioMock).toBeCalledTimes(0);
    expect(extractFromStackedCheckboxMock).toBeCalledTimes(0);
    expect(extractFromSliderMock).toBeCalledTimes(0);
    expect(extractFromStackedSliderMock).toBeCalledTimes(0);
  });
});
