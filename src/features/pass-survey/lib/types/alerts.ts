export type ActivityAlerts = Record<string, ActivityItemAlerts>;

type AlertMessage = string;

type AlertId = string;

type AlertPayload = Record<AlertId, AlertMessage>;

type ActivityItemAlerts =
  | RadioItemAlerts
  | CheckboxItemAlerts
  | StackedRadioItemAlerts
  | StackedCheckboxItemAlerts
  | SliderItemAlerts
  | StackedSliderItemAlerts
  | any;

type RadioItemAlerts = {
  type: 'Radio';
  payload: AlertMessage;
};

type CheckboxItemAlerts = {
  type: 'Checkbox';
  payload: AlertPayload;
};

type StackedRadioItemAlerts = {
  type: 'StackedRadio';
  payload: AlertPayload;
};

type StackedCheckboxItemAlerts = {
  type: 'StackedCheckbox';
  payload: AlertPayload;
};

type SliderItemAlerts = {
  type: 'Slider';
  payload: AlertPayload;
};

type StackedSliderItemAlerts = {
  type: 'StackedSlider';
  payload: AlertPayload;
};
