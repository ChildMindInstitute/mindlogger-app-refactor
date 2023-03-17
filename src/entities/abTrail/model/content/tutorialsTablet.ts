import { DeviceTutorials, TutorialPayload } from '../../lib';

const tutorialTabletFirst: TutorialPayload = [
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
  { text: 'And end here.', nodeLabel: 8 },
  { text: 'Click next to start' },
];

const tutorialTableSecond: TutorialPayload = [
  { text: 'On this screen are more numbers in circles.' },
  {
    text: 'You will take a pen and draw a line from one circle to the next, in order.',
  },
  { text: 'Start at 1.', nodeLabel: 1 },
  { text: 'And End here.', nodeLabel: 25 },
  {
    text: 'Please try not to lift the pen as you move from one circle to the next.',
  },
  { text: 'Work as quickly as you can.' },
  { text: 'Click next to start' },
];

const tutorialTabletThird: TutorialPayload = [
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
  { text: 'And end here.', nodeLabel: 'D' },
  { text: 'Click next to start' },
];

const tutorialTabletFourth: TutorialPayload = [
  { text: 'On this screen there are more numbers and letters in circles.' },
  { text: 'You will take a pen and draw a line from one circle to the next.' },
  { text: 'Alternating in order between the numbers and letters.' },
  { text: 'Start at 1.', nodeLabel: 1 },
  { text: 'And end here.', nodeLabel: 13 },
  {
    text: 'Please try not to lift the pen as you move from one circle to the next.',
  },
  { text: 'Work as quickly as you can.' },
  { text: 'Click next to start' },
];

export const TabletTutorials: DeviceTutorials = {
  0: tutorialTabletFirst,
  1: tutorialTableSecond,
  2: tutorialTabletThird,
  3: tutorialTabletFourth,
};
