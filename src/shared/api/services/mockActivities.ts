import { ActivityDto, FlankerAnswerSettings } from '@app/shared/api';

import { flankerWithStFxImages } from './mocks/FlankerWithStFxImages';
import { flankerSettingsTextSignsDto } from './mocks/FlankerWithTextsSigns';

const testMessage1 =
  'Start by placing the point of the pen at the center of the spiral (S), and trace out along the dashed blue line to the end of the sprial (E).  Try to stay on the dashed blue line while tracing. You will do this five times.';

const testMessage2 =
  'Write the entire alphabet in order using lower-case (small) letters. Write each letter in one of the boxes below. If you make a mistake, just keep going. Make sure you print and do not use cursive handwriting. Work as quickly as you can without making mistakes. Remember to print in lower-case, not capital letters. Press the “Next” button as soon as you finish.';

const grid: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '101',
      name: 'test name',
      question: testMessage2,
      order: 0,
      timer: null,
      responseType: 'drawing',
      isHidden: false,
      config: {
        removeUndoButton: false,
        navigationToTop: true,
        timer: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: true,
        skippableItem: false,
      },
      responseValues: {
        drawingExample: '',
        drawingBackground:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/9qPz3D1kyzwD2pAAHpP5Hv.jpeg',
      },
    },
  ],
};

const vortex: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '102',
      name: 'test name',
      question: testMessage1,
      order: 0,
      responseType: 'drawing',
      timer: null,
      isHidden: false,
      config: {
        removeUndoButton: false,
        navigationToTop: false,
        timer: null,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: true,
        skippableItem: false,
      },
      responseValues: {
        drawingExample: '',
        drawingBackground:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/w93voaqZA7ZGoZryorBvQc.jpeg',
      },
    },
  ],
};

const allDrawing: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [...grid.items, ...vortex.items],
};

export const DrawingTestActivity = {
  grid,
  vortex,
  all: allDrawing,
};

export const AbTestActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '103',
      name: 'A/B Test',
      responseType: 'abTest',
      timer: null,
      isHidden: false,
      config: {
        timer: null,
      },
      responseValues: {
        device: 'Phone',
      },
      question: '',
      order: 0,
    },
  ],
};

const FlankerWithImageActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '100',
      name: 'Flanker',
      timer: null,
      question: '',
      responseType: 'flanker',
      config: null,
      responseValues: flankerWithStFxImages,
      order: 0,
      isHidden: false,
    },
  ],
};

const FlankerWithStSFxActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '100',
      name: 'Flanker',
      timer: null,
      question: '',
      responseType: 'flanker',
      config: null,
      responseValues: {} as FlankerAnswerSettings,
      order: 0,
      isHidden: false,
    },
  ],
};

const FlankerWithTextSignsActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '100',
      name: 'Flanker',
      question: '',
      responseType: 'flanker',
      config: null,
      responseValues: flankerSettingsTextSignsDto,
      order: 0,
      timer: null,
      isHidden: false,
    },
  ],
};

const FlankerAllTypesActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    ...FlankerWithTextSignsActivity.items,
    ...FlankerWithImageActivity.items,
    ...FlankerWithTextSignsActivity.items,
  ],
};

export const TextActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '104',
      name: 'Text input',
      question: '',
      timer: null,
      responseType: 'text',
      config: {
        maxResponseLength: 20,
        timer: null,
        correctAnswerRequired: false,
        correctAnswer: 'Hello',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        removeBackButton: false,
        skippableItem: false,
      },
      responseValues: null,
      isHidden: false,
      order: 0,
    },
  ],
};

export const GeolocationActivity: ActivityDto = {
  id: 'aid1',
  name: 'Activity number 1',
  description:
    'Activity description number 1 Activity description 1 number 1 Activity description number 1',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isHidden: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  items: [
    {
      id: '104',
      name: 'Geolocation',
      question: '',
      responseType: 'geolocation',
      timer: null,
      isHidden: false,
      config: {
        timer: null,
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
      },
      responseValues: null,
      order: 0,
    },
  ],
};

export const SliderTestActivity: ActivityDto = {
  id: 'aid1',
  name: 'Slider Activity',
  description: 'Slider Activity Description',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  isHidden: false,
  order: 0,
  items: [
    {
      responseValues: {
        minValue: 0,
        maxValue: 10,
        minImage: 'https://static.thenounproject.com/png/1825711-200.png',
        maxImage:
          'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
        minLabel: 'Minimum label',
        maxLabel: 'Maximum label',
      },
      id: '105',
      timer: null,
      config: {
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: true,
        skippableItem: false,
        timer: null,
        showTickMarks: true,
        showTickLabels: true,
        continuousSlider: true,
        addScores: false,
        setAlerts: false,
      },
      responseType: 'slider',
      name: 'slidename',
      question: 'Choose some number',
      isHidden: false,
      order: 0,
    },
  ],
};

export const FlankerActivity = {
  withImage: FlankerWithImageActivity,
  withStSFx: FlankerWithStSFxActivity,
  withTextSings: FlankerWithTextSignsActivity,
  all: FlankerAllTypesActivity,
};

const TestActivities = [
  // grid,
  // vortex,
  // AbTestActivity,
  // TextActivity,
  // SliderTestActivity,
  FlankerWithTextSignsActivity,
  //FlankerWithImageActivity
];

let index = 0;

export const getTestActivity = () => {
  return TestActivities[index++ % TestActivities.length];
};
