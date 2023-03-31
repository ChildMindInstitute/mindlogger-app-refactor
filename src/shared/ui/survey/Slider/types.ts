type Config = {
  leftTitle: string | null;
  rightTitle: string | null;
  minValue: number;
  maxValue: number;
  leftImageUrl: string | null;
  rightImageUrl: string | null;
};

type SliderConfig = Config & {
  showTitles: boolean | null;
  showTickMarks: boolean | null;
  showTickLabels: boolean | null;
  isContinuousSlider: boolean | null;
};

export type SliderProps = {
  config: SliderConfig;
  initialValue?: number;
  onChange: (value: number) => void;
  onPress?: () => void;
  onRelease?: () => void;
};

type StackedSliderConfig = (Config & { sliderLabel: string })[];

export type StackedSliderProps = {
  config: StackedSliderConfig;
  initialValues?: (number | null)[];
  onChange: (arrayOfValues: number[]) => void;
  onPress?: () => void;
  onRelease?: () => void;
};
