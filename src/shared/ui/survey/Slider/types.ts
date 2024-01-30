type Config = {
  leftTitle: string | null;
  rightTitle: string | null;
  minValue: number;
  maxValue: number;
  leftImageUrl: string | null;
  rightImageUrl: string | null;
};

export type SliderConfig = Config & {
  showTickMarks?: boolean | null;
  showTickLabels?: boolean | null;
  isContinuousSlider?: boolean | null;
};

export type SliderProps = {
  config: SliderConfig;
  initialValue: number | null;
  sliderLabel?: string;
  onChange: (value: number) => void;
  onPress?: () => void;
  onRelease?: () => void;
};

export type StackedSliderConfig = {
  rows: (Config & {
    label: string;
    id: string;
  })[];
  addScores: boolean;
  setAlerts: boolean;
};

export type StackedSliderProps = {
  config: StackedSliderConfig;
  values: number[] | null;
  onChange: (arrayOfValues: number[]) => void;
  onPress?: () => void;
  onRelease?: () => void;
};
