import { DeviceTutorials, TutorialPayload } from './types';

const tutorialMobileFirst: TutorialPayload = [
  { text: 'There are numbers in circles on this screen.' },
  {
    text: 'You will take a pen and draw a line from one number to the next, in order.',
  },
  { text: 'Start at 1.', nodeLabel: 1 },
  { text: 'Then go to 2.', nodeLabel: 2 },
  { text: 'Then 3, and so on.', nodeLabel: 3 },
  {
    text: 'Please try not to lift the pen as you move from one number to the next. Work as quickly as you can.',
  },
  { text: 'Begin here.', nodeLabel: 1 },
  { text: 'And end here.', nodeLabel: 11 },
  { text: 'Click next to start' },
];

const tutorialMobileSecond: TutorialPayload = [
  { text: 'On this screen are more numbers in circles.' },
  {
    text: 'You will take a pen and draw a line from one circle to the next, in order.',
  },
  { text: 'Start at 1.', nodeLabel: 1 },
  { text: 'And End here.', nodeLabel: 11 },
  {
    text: 'Please try not to lift the pen as you move from one circle to the next.',
  },
  { text: 'Work as quickly as you can.' },
  { text: 'Click next to start' },
];

const tutorialMobileThird: TutorialPayload = [
  { text: 'There are numbers and letters in circles on this screen.' },
  {
    text: 'You will take a pen and draw a line alternating in order between the numbers and letters.',
  },
  { text: 'Start at number 1.', nodeLabel: 1 },
  { text: 'Then go to the first letter A.', nodeLabel: 'A' },
  { text: 'Then go to the next number 2.', nodeLabel: 2 },
  { text: 'Then go to the next letter B, and so on.', nodeLabel: 'B' },
  {
    text: 'Please try not to lift the pen as you move from one number to the next. Work as quickly as you can.',
  },
  { text: 'Begin here.', nodeLabel: 1 },
  { text: 'And end here.', nodeLabel: 6 },
  { text: 'Click next to start' },
];

const tutorialMobileFourth: TutorialPayload = [
  { text: 'On this screen there are more numbers and letters in circles.' },
  { text: 'You will take a pen and draw a line from one circle to the next.' },
  { text: 'Alternating in order between the numbers and letters.' },
  { text: 'Start at 1.', nodeLabel: 1 },
  { text: 'And end here.', nodeLabel: 6 },
  {
    text: 'Please try not to lift the pen as you move from one circle to the next.',
  },
  { text: 'Work as quickly as you can.' },
  { text: 'Click next to start' },
];

export const MobileTutorials: DeviceTutorials = {
  0: tutorialMobileFirst,
  1: tutorialMobileSecond,
  2: tutorialMobileThird,
  3: tutorialMobileFourth,
};
