import {
  AudioPipelineItem,
  CheckboxPipelineItem,
  PipelineItem,
  RadioPipelineItem,
  SliderPipelineItem,
} from '../../lib';
import { IScoresCalculator, ScoresCalculator } from '../ScoresCalculator';

const getEmptyCheckboxesItem = (name: string): CheckboxPipelineItem => {
  const result: CheckboxPipelineItem = {
    name,
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [],
    },
    type: 'Checkbox',
  };
  return result;
};

const fillOptionsForCheckboxes = (item: CheckboxPipelineItem, from = 1) => {
  for (let i = from; i <= 5; i++) {
    item.payload.options.push({
      alert: null,
      color: null,
      id: `mock-id-${i}`,
      image: null,
      isHidden: false,
      text: `mock-text-${i}`,
      tooltip: null,
      score: i * 10,
      value: i,
      isNoneOption: false,
    });
  }
};

const getEmptyAudioItem = (name: string): AudioPipelineItem => {
  const result: AudioPipelineItem = {
    name,
    timer: null,
    payload: {} as any,
    type: 'Audio',
  };
  return result;
};

const getEmptyRadioItem = (name: string): RadioPipelineItem => {
  const result: RadioPipelineItem = {
    name,
    timer: null,
    payload: {
      addTooltip: false,
      randomizeOptions: false,
      setAlerts: false,
      setPalette: false,
      options: [],
      autoAdvance: false,
    },
    type: 'Radio',
  };
  return result;
};

const fillOptionsForRadio = (item: RadioPipelineItem, from = 1) => {
  for (let i = from; i <= 5; i++) {
    item.payload.options.push({
      alert: null,
      color: null,
      id: `mock-id-${i}`,
      image: null,
      isHidden: false,
      text: `mock-text-${i}`,
      tooltip: null,
      score: i * 10,
      value: i,
    });
  }
};

const getEmptySliderItem = (name: string): SliderPipelineItem => {
  const result: SliderPipelineItem = {
    name,
    timer: null,
    payload: {
      isContinuousSlider: false,
      leftImageUrl: null,
      rightImageUrl: null,
      leftTitle: 'left-title',
      rightTitle: 'right-title',
      showTickLabels: false,
      showTickMarks: false,
      alerts: null,
      scores: [],
      minValue: 2,
      maxValue: 9,
    },
    type: 'Slider',
  };
  return result;
};

const fillOptionsForSlider = (item: SliderPipelineItem, count: number) => {
  for (let i = 0; i < count; i++) {
    item.payload.scores.push(i * 10);
  }
};

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
    fillOptionsForSlider(sliderItem, 5);

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
    fillOptionsForSlider(sliderItem, 5);

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
    fillOptionsForSlider(sliderItem, 5);

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
    fillOptionsForSlider(sliderItem, 5);

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
    fillOptionsForSlider(sliderItem, 5);

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
