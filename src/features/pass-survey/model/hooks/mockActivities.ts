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
  order: 0,
  isHidden: false,
  items: [
    {
      id: '101',
      name: 'test name',
      question: testMessage2,
      order: 0,
      isHidden: false,
      responseType: 'drawing',
      timer: null,
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
      isHidden: false,
      responseType: 'drawing',
      timer: null,
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
      config: {
        timer: null,
      },
      responseValues: {
        device: 'Phone',
      },
      question: '',
      order: 0,
      isHidden: false,
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
      question: '',
      responseType: 'flanker',
      timer: null,
      config: FlankerWithImageOnButton,
      responseValues: {},
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
      question: '',
      responseType: 'flanker',
      timer: null,
      config: FlankerWithStFxImages,
      responseValues: {},
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
      timer: null,
      config: FlankerWithTextsSigns,
      responseValues: {},
      order: 0,
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
      question: 'Type some text',
      responseType: 'text',
      timer: 60,
      config: {
        maxResponseLength: 10,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        removeBackButton: false,
        skippableItem: false,
      },
      responseValues: null,
      order: 0,
      isHidden: false,
    },
    {
      id: '105',
      name: 'Text input 2',
      question: '',
      responseType: 'text',
      timer: 5,
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
      order: 1,
    },
    {
      id: '106',
      name: 'Text input 6',
      question: '',
      responseType: 'text',
      timer: 5,
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
      order: 2,
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
  order: 0,
  isHidden: false,
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
      timer: null,
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
      isHidden: false,
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
  order: 0,
  isHidden: false,
  items: [
    {
      id: '105',
      name: 'Number select',
      question: 'What',
      timer: null,
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
      isHidden: false,
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
  order: 0,
  isHidden: false,
  items: [
    {
      id: '2345',
      name: 'checkboxname',
      question: 'Choose checkboxes',
      responseType: 'multiSelect',
      timer: null,
      order: 0,
      isHidden: false,
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
  order: 0,
  isHidden: false,
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
      timer: null,
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
      isHidden: false,
    },
  ],
};

export const AllTextsActivity: ActivityDto = {
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
  order: 0,
  isHidden: false,
  items: [
    {
      id: '12319758',
      name: 'Text input',
      timer: null,
      question:
        '## Welcome to the demo session!\nWe\'ll start with the text fields.\nType "Hello!"',
      responseType: 'text',
      config: {
        maxResponseLength: 20,
        correctAnswerRequired: true,
        correctAnswer: 'Hello!',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        removeBackButton: false,
        skippableItem: false,
      },
      responseValues: null,
      order: 0,
      isHidden: false,
    },
    {
      id: '346',
      name: 'Text input',
      question: 'Type no more than 10 symbols. Can skip',
      responseType: 'text',
      timer: null,
      config: {
        maxResponseLength: 10,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: false,
        responseDataIdentifier: false,
        removeBackButton: false,
        skippableItem: true,
      },
      responseValues: null,
      order: 1,
      isHidden: false,
    },
    {
      id: '346',
      name: 'Text input',
      question: 'Type a number. Back button removed',
      responseType: 'text',
      timer: null,
      config: {
        maxResponseLength: 10,
        correctAnswerRequired: false,
        correctAnswer: '',
        numericalResponseRequired: true,
        responseDataIdentifier: false,
        removeBackButton: true,
        skippableItem: false,
      },
      responseValues: null,
      order: 1,
      isHidden: false,
    },
  ],
};

export const AllCheckboxesActivity: ActivityDto = {
  id: 'aid1',
  name: 'Check Activity',
  description: 'Radio Activity Description',
  image:
    'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
  splashScreen:
    'https://www.akc.org/wp-content/themes/akc/component-library/assets/img/welcome.jpg',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  responseIsEditable: false,
  order: 0,
  isHidden: false,
  items: [
    {
      id: '346574',
      name: 'checkboxname',
      question:
        'These are colored randomized checkboxes. Some of them have a tooltip',
      responseType: 'multiSelect',
      timer: null,
      order: 0,
      isHidden: false,
      responseValues: {
        options: [
          {
            id: 'checkbox-id-1',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'This is a **tooltip**',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: 'checkbox-id-2',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'This is a *tooltip*',
            color: '#000000',
            isHidden: false,
          },
          {
            id: 'checkbox-id-3',
            text: 'Some text',
            image: 'https://cdn-icons-png.flaticon.com/512/1287/1287087.png',
            score: null,
            tooltip:
              'This is a ~~tooltip~~! A long long loooong loooooooooooong text',
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
    {
      id: '12495124',
      name: 'checkboxname',
      timer: null,
      question: 'These are simple checkboxes. Can skip. Cannot move back.',
      responseType: 'multiSelect',
      order: 0,
      isHidden: false,
      responseValues: {
        options: [
          {
            id: 'checkbox-id-4',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'This is a **tooltip**',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: 'checkbox-id-5',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'This is a *tooltip*',
            color: '#000000',
            isHidden: false,
          },
          {
            id: 'checkbox-id-6',
            text: 'Some text',
            image: 'https://cdn-icons-png.flaticon.com/512/1287/1287087.png',
            score: null,
            tooltip: '- 1. one\n- 2. two\n- 3. three\n',
            color: '#F8FF00',
            isHidden: false,
          },
        ],
      },
      config: {
        randomizeOptions: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: true,
        skippableItem: true,
        timer: null,
        addScores: false,
      },
    },
    {
      id: '12495124',
      name: 'checkboxname',
      question: 'Pick any and give a required text response.',
      responseType: 'multiSelect',
      timer: null,
      order: 0,
      isHidden: false,
      responseValues: {
        options: [
          {
            id: 'checkbox-id-07',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: 'This is a tooltip',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: 'checkbox-id-8',
            text: 'Some text',
            image: null,
            score: null,
            tooltip: '',
            color: '#000000',
            isHidden: false,
          },
          {
            id: 'checkbox-id-9',
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
        randomizeOptions: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: true,
        },
        removeBackButton: false,
        skippableItem: false,
        timer: null,
        addScores: false,
      },
    },
  ],
};

export const AllRadioActivity: ActivityDto = {
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
  order: 0,
  isHidden: false,
  items: [
    {
      timer: null,
      responseValues: {
        options: [
          {
            id: '1',
            text: 'First radio pink with tooltip',
            image: null,
            score: null,
            tooltip: 'This is a ++tooltip++',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: '2',
            text: 'Second radio black',
            image: null,
            score: null,
            tooltip:
              'Which kind of music do you like?\n- Pop\n- Classic\n- Dance/Electronic\n- Rock\n',
            color: '#000000',
            isHidden: false,
          },
          {
            id: '3',
            text: 'Third radio yellow',
            image: null,
            score: null,
            tooltip: 'This this a ~tooltip in a subscript~',
            color: '#F8FF00',
            isHidden: false,
          },
          {
            id: '4',
            text: 'Fourth radio red',
            image: null,
            score: null,
            tooltip: 'This this a ^tooltip in a superscript^',
            color: '#FF0000',
            isHidden: false,
          },
          {
            id: '5',
            text: 'Fifth radio green',
            image: null,
            score: null,
            tooltip: 'This is a ==highlighted tooltip==',
            color: '#00FF00',
            isHidden: false,
          },
          {
            id: '6',
            text: 'Sixth radio gray',
            image:
              'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
            score: null,
            tooltip: `This is a cat:
            ![Cat](https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg)`,
            color: '#EEEEEE',
            isHidden: false,
          },
          {
            id: '7',
            text: 'Seventh radio no color',
            image:
              'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
            score: null,
            tooltip: 'This is a link: [All about cats](https://cats.com)',
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
      id: '234689',
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
      question: 'These are colored randomized radios. Tooltips',
      order: 0,
      isHidden: false,
    },
    {
      responseValues: {
        options: [
          {
            id: '1',
            text: 'First radio button',
            image: null,
            score: null,
            tooltip: 'Tooltip text',
            color: '#C800FF',
            isHidden: false,
          },
          {
            id: '2',
            text: 'Second radio button',
            image: null,
            score: null,
            tooltip: null,
            color: '#000000',
            isHidden: false,
          },
          {
            id: '3',
            text: 'Third radio button',
            image: null,
            score: null,
            tooltip: null,
            color: '#F8FF00',
            isHidden: false,
          },
          {
            id: '4',
            text: 'Fourth radio button',
            image: null,
            score: null,
            tooltip: null,
            color: '#FF0000',
            isHidden: false,
          },
          {
            id: '5',
            text: 'Fifth radio button',
            image: null,
            score: null,
            tooltip: null,
            color: '#00FF00',
            isHidden: false,
          },
          {
            id: '6',
            text: 'Sixth radio button',
            image:
              'https://www.shutterstock.com/image-vector/tachometer-speedometer-indicator-icon-performance-260nw-296770265.jpg',
            score: null,
            tooltip: null,
            color: '#EEEEEE',
            isHidden: false,
          },
          {
            id: '7',
            text: 'Seventh radio button',
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
      id: '85670',
      config: {
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: true,
        },
        removeBackButton: true,
        skippableItem: false,
        timer: null,
        addScores: false,
        setAlerts: false,
        randomizeOptions: false,
        addTooltip: false,
        setPalette: false,
      },
      responseType: 'singleSelect',
      name: 'radioName',
      timer: null,
      question:
        'These are simple single select. Cannot move back. Has required text field',
      order: 1,
      isHidden: false,
    },
  ],
};

export const AllSliderActivity: ActivityDto = {
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
  order: 0,
  isHidden: false,
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
      id: '345',
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
        continuousSlider: false,
        addScores: false,
        setAlerts: false,
      },
      responseType: 'slider',
      name: 'slidename',
      question: 'Choose a number. Cannot move back',
      order: 0,
      isHidden: false,
    },
    {
      responseValues: {
        minValue: 1,
        maxValue: 10,
        minImage: null,
        maxImage: null,
        minLabel: 'Sad',
        maxLabel: 'Happy',
      },
      id: '345',
      timer: null,
      config: {
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: true,
        timer: null,
        showTickMarks: false,
        showTickLabels: true,
        continuousSlider: false,
        addScores: false,
        setAlerts: false,
      },
      responseType: 'slider',
      name: 'sliderActivityItem',
      question: 'On a scale of 1 to 10, how happy are you?. You can skip',
      order: 1,
      isHidden: false,
    },
    {
      responseValues: {
        minValue: 1,
        maxValue: 5,
        minImage: null,
        maxImage: null,
        minLabel: 'Start',
        maxLabel: 'End',
      },
      id: '345',
      config: {
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: true,
        timer: null,
        showTickMarks: true,
        showTickLabels: false,
        continuousSlider: true,
        addScores: false,
        setAlerts: false,
      },
      timer: null,
      responseType: 'slider',
      name: 'sliderActivityItem',
      question: 'Choose any. And give an optional text response.',
      order: 0,
      isHidden: false,
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
  order: 0,
  isHidden: false,
  items: [
    ...AllTextsActivity.items,
    ...AllCheckboxesActivity.items,
    ...AllRadioActivity.items,
    ...AllSliderActivity.items,
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
