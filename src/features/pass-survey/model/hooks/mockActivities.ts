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
      id: 100,
      inputType: 'DrawingTest',
      config: {
        imageUrl: null,
        backgroundImageUrl:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/9qPz3D1kyzwD2pAAHpP5Hv.jpeg',
      },
      timer: 0,
      hasTokenValue: true,
      isSkippable: true,
      hasAlert: true,
      hasScore: true,
      isAbleToMoveToPrevious: true,
      hasTextResponse: true,
      question: testMessage2,
      order: 0,
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
      id: 100,
      inputType: 'DrawingTest',
      config: {
        imageUrl: null,
        backgroundImageUrl:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/w93voaqZA7ZGoZryorBvQc.jpeg',
      },
      timer: 0,
      hasTokenValue: true,
      isSkippable: true,
      hasAlert: true,
      hasScore: true,
      isAbleToMoveToPrevious: true,
      hasTextResponse: true,
      question: testMessage1,
      order: 0,
    },
  ],
};

export const DrawingTestActivity = {
  grid,
  vortex,
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
      id: 100,
      inputType: 'AbTest',
      config: {
        device: 'Phone',
      },
      timer: 0,
      hasTokenValue: true,
      isSkippable: true,
      hasAlert: true,
      hasScore: true,
      isAbleToMoveToPrevious: true,
      hasTextResponse: true,
      order: 0,
    },
  ],
};
