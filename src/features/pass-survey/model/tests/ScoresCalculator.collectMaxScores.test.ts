import {
  fillOptionsForCheckboxes,
  fillOptionsForRadio,
  fillScoresForSlider,
  getEmptyAudioItem,
  getEmptyCheckboxesItem,
  getEmptyRadioItem,
  getEmptySliderItem,
} from './testHelpers';
import { PipelineItem } from '../../lib';
import { IScoresCalculator, ScoresCalculator } from '../ScoresCalculator';

describe('ScoresCalculator: test collectMaxScores', () => {
  let calculator: IScoresCalculator;

  beforeEach(() => {
    calculator = new ScoresCalculator();
  });

  it('Should return [null, null, null] when selectedItems is []', () => {
    const checkboxesItem: PipelineItem = getEmptyCheckboxesItem('cb-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('r-item');
    const sliderItem: PipelineItem = getEmptySliderItem('sl-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);
    fillScoresForSlider(sliderItem, 5);

    const selectedItems: string[] = [];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [checkboxesItem, radiosItem, sliderItem],
      selectedItems,
    );

    expect(result).toEqual([null, null, null]);
  });

  it("Should return [150, 50, 40] when selectedItems are ['checkbox-item', 'radio-item', 'slider-item']", () => {
    const checkboxesItem: PipelineItem =
      getEmptyCheckboxesItem('checkbox-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('radio-item');
    const sliderItem: PipelineItem = getEmptySliderItem('slider-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);
    fillScoresForSlider(sliderItem, 5);

    const selectedItems: string[] = [
      'checkbox-item',
      'radio-item',
      'slider-item',
    ];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [checkboxesItem, radiosItem, sliderItem],
      selectedItems,
    );

    expect(result).toEqual([150, 50, 40]);
  });

  it("Should return [40, 50, 150] when selectedItems are ['checkbox-item', 'radio-item', 'slider-item'] and pipelineItems reversed", () => {
    const checkboxesItem: PipelineItem =
      getEmptyCheckboxesItem('checkbox-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('radio-item');
    const sliderItem: PipelineItem = getEmptySliderItem('slider-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);
    fillScoresForSlider(sliderItem, 5);

    const selectedItems: string[] = [
      'checkbox-item',
      'radio-item',
      'slider-item',
    ];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [sliderItem, radiosItem, checkboxesItem],
      selectedItems,
    );

    expect(result).toEqual([40, 50, 150]);
  });

  it("Should return [40, 50, 50, 150, 40] when selectedItems are ['checkbox-item', 'radio-item', 'slider-item'] and pipelineItems ['slider-item', 'radio-item', 'radio-item', 'checkbox-item', 'slider-item']", () => {
    const checkboxesItem: PipelineItem =
      getEmptyCheckboxesItem('checkbox-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('radio-item');
    const sliderItem: PipelineItem = getEmptySliderItem('slider-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);
    fillScoresForSlider(sliderItem, 5);

    const selectedItems: string[] = [
      'checkbox-item',
      'radio-item',
      'slider-item',
    ];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [sliderItem, radiosItem, radiosItem, checkboxesItem, sliderItem],
      selectedItems,
    );

    expect(result).toEqual([40, 50, 50, 150, 40]);
  });

  it("Should return [150, 50] when selectedItems are ['checkbox-item', 'radio-item'] and pipelineItems are ['checkbox-item', 'radio-item', 'slider-item']", () => {
    const checkboxesItem: PipelineItem =
      getEmptyCheckboxesItem('checkbox-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('radio-item');
    const sliderItem: PipelineItem = getEmptySliderItem('slider-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);
    fillScoresForSlider(sliderItem, 5);

    const selectedItems: string[] = ['checkbox-item', 'radio-item'];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [checkboxesItem, radiosItem, sliderItem],
      selectedItems,
    );

    expect(result).toEqual([150, 50, null]);
  });

  it("Should return [150, null, 50] when selectedItems are ['checkbox-item', 'audio-item', 'radio-item'] and pipelineItems are ['checkbox-item', 'audio-item', 'radio-item']", () => {
    const checkboxesItem: PipelineItem =
      getEmptyCheckboxesItem('checkbox-item');
    const radiosItem: PipelineItem = getEmptyRadioItem('radio-item');
    const audioItem: PipelineItem = getEmptyAudioItem('audio-item');

    fillOptionsForCheckboxes(checkboxesItem);
    fillOptionsForRadio(radiosItem);

    const selectedItems: string[] = [
      'checkbox-item',
      'audio-item',
      'radio-item',
    ];

    // @ts-expect-error
    const result = calculator.collectMaxScores(
      [checkboxesItem, audioItem, radiosItem],
      selectedItems,
    );

    expect(result).toEqual([150, null, 50]);
  });
});
