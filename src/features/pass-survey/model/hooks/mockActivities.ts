import {
  FlankerWithImageOnButton,
  FlankerWithStFxImages,
  FlankerWithTextsSigns,
} from '@app/entities/flanker';
import { ActivityDto } from '@app/shared/api';

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
  ordering: 0,
  items: [
    {
      id: '101',
      name: 'test name',
      question: testMessage2,
      order: 0,
      responseType: 'drawing',
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
  ordering: 0,
  items: [
    {
      id: '102',
      name: 'test name',
      question: testMessage1,
      order: 0,
      responseType: 'drawing',
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
  ordering: 0,
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
  ordering: 0,
  items: [
    {
      id: '103',
      name: 'A/B Test',
      responseType: 'abTest',
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
  ordering: 0,
  items: [
    {
      id: '100',
      name: 'Flanker',
      question: '',
      responseType: 'flanker',
      config: FlankerWithImageOnButton,
      responseValues: {},
      order: 0,
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
  ordering: 0,
  items: [
    {
      id: '100',
      name: 'Flanker',
      question: '',
      responseType: 'flanker',
      config: FlankerWithStFxImages,
      responseValues: {},
      order: 0,
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
  ordering: 0,
  items: [
    {
      id: '100',
      name: 'Flanker',
      question: '',
      responseType: 'flanker',
      config: FlankerWithTextsSigns,
      responseValues: {},
      order: 0,
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
  ordering: 0,
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
  ordering: 0,
  items: [
    {
      id: '104',
      name: 'Text input',
      question: '',
      responseType: 'text',
      config: {
        maxResponseLength: 20,
        correctAnswerRequired: false,
        correctAnswer: 'Hello',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        removeBackButton: false,
        skippableItem: false,
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
  ordering: 0,
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
      id: '101231',
      config: {
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: false,
        timer: null,
        showTickMarks: true,
        showTickLabels: true,
        continuousSlider: false,
        addScores: false,
        setAlerts: false,
      },
      responseType: 'slider',
      name: 'slidename',
      question: 'Choose some number',
      order: 0,
    },
  ],
};

export const NumberSelectActivity: ActivityDto = {
  id: 'aid1',
  name: 'Number Selection Activity',
  description: 'Number Selection Activity Description',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ordering: 0,
  items: [
    {
      id: '105',
      name: 'Number select',
      question: 'What',
      responseType: 'numberSelect',
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: true,
        },
      },
      responseValues: {
        maxValue: 50,
        minValue: 20,
      },
      order: 0,
    },
  ],
};

export const CheckboxTestActivity: ActivityDto = {
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
  ordering: 0,
  items: [
    {
      id: '2345',
      name: 'checkboxname',
      question: 'Choose checkboxes',
      responseType: 'multiSelect',
      order: 0,
      responseValues: {
        options: [
          {
            id: 'checkbox-id-0',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'this is some tooltip',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: 'checkbox-id-1',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: '',
            color: '#000000',
            isHidden: false,
          },
          {
            id: 'checkbox-id-two',
            text: 'Some text',
            image: 'https://cdn-icons-png.flaticon.com/512/1287/1287087.png',
            score: null,
            tooltip: null,
            color: '#F8FF00',
            isHidden: false,
          },
        ],
      },
      config: {
        randomizeOptions: true,
        setAlerts: false,
        addTooltip: true,
        setPalette: true,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: false,
        timer: null,
        addScores: false,
      },
    },
  ],
};

export const RadioTestActivity: ActivityDto = {
  id: 'aid1',
  name: 'Radio Activity',
  description: 'Radio Activity Description',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ordering: 0,
  items: [
    {
      responseValues: {
        options: [
          {
            id: '1',
            text: 'First radio pink with tooltip',
            image: null,
            score: null,
            tooltip: ' Tooltip text',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: '2',
            text: 'Second radio black',
            image: null,
            score: null,
            tooltip: null,
            color: '#000000',
            isHidden: false,
          },
          {
            id: '3',
            text: 'Third radio yellow',
            image: null,
            score: null,
            tooltip: null,
            color: '#F8FF00',
            isHidden: false,
          },
          {
            id: '4',
            text: 'Fourth radio red',
            image: null,
            score: null,
            tooltip: null,
            color: '#FF0000',
            isHidden: false,
          },
          {
            id: '5',
            text: 'Fifth radio green',
            image: null,
            score: null,
            tooltip: null,
            color: '#00FF00',
            isHidden: false,
          },
          {
            id: '6',
            text: 'Sixth radio gray',
            image:
              'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
            score: null,
            tooltip: null,
            color: '#EEEEEE',
            isHidden: false,
          },
          {
            id: '7',
            text: 'Seventh radio no color',
            image:
              'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
            score: null,
            tooltip: null,
            color: null,
            isHidden: false,
          },
          {
            id: '8',
            text: 'Hidden radio',
            image: null,
            score: null,
            tooltip: null,
            color: null,
            isHidden: true,
          },
        ],
      },
      id: '108',
      config: {
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: false,
        timer: null,
        addScores: false,
        setAlerts: false,
        randomizeOptions: true,
        addTooltip: true,
        setPalette: true,
      },
      responseType: 'singleSelect',
      name: 'radioName',
      question: 'Choose some number radio item',
      order: 0,
    },
  ],
};

export const DemoActivity: ActivityDto = {
  id: 'aid1',
  name: 'Radio Activity',
  description: 'Radio Activity Description',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen:
    'https://www.akc.org/wp-content/themes/akc/component-library/assets/img/welcome.jpg',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  ordering: 0,
  items: [
    ...TextActivity.items,
    ...RadioTestActivity.items,
    ...CheckboxTestActivity.items,
    ...SliderTestActivity.items,
  ],
};

export const FlankerActivity = {
  withImage: FlankerWithImageActivity,
  withStSFx: FlankerWithStSFxActivity,
  withTextSings: FlankerWithTextSignsActivity,
  all: FlankerAllTypesActivity,
};

const TestActivities = [
  FlankerActivity.withImage,
  FlankerActivity.withStSFx,
  FlankerActivity.withTextSings,
  DrawingTestActivity.grid,
  DrawingTestActivity.vortex,
  AbTestActivity,
  SliderTestActivity,
  CheckboxTestActivity,
];

export const getRandomTestActivity = () => {
  const maxIndex = TestActivities.length - 1;
  const randomId = +Math.random().toFixed(0) % maxIndex;

  return TestActivities[randomId];
};
