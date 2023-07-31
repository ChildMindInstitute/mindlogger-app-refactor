type Config = {
  leftTitle: string | null;
  rightTitle: string | null;
  minValue: number;
  maxValue: number;
  leftImageUrl: string | null;
  rightImageUrl: string | null;
};

type SliderConfig = Config & {
  showTickMarks?: boolean | null;
  showTickLabels?: boolean | null;
  isContinuousSlider?: boolean | null;
};

export type SliderProps = {
  config: SliderConfig;
  initialValue: number | null;
  onChange: (value: number) => void;
  onPress?: () => void;
  onRelease?: () => void;
};

type StackedSliderConfig = {
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
