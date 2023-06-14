import { DeviceTutorials, TutorialPayload } from '../../lib';

const tutorialMobileFirst: TutorialPayload = [
  `In this task, you will see a disc that will drift either to the left or right side of the screen.
 Your job will be to keep the disc in the middle of the screen.
 If the disc is moving to the right, swipe left of control bar to bring it back to the center.
 If the disc is moving to the left, swipe right of control bar to bring the disc back to center.
 Do not let the disc touch the walls to the far left or right of the screen.
 There will be two phases to this task, a Challenge Phase, and a Focus Phase.
![Research_-_Science_for_Change.jpg](https://mindlogger-applet-contents.s3.amazonaws.com/images/urBwX2L8R2E4RFFaME2LJg.jpeg)`,
  `This is the Challenge Phase.
 There will be 3 trials.
 Each trial will begin at an easy level, but it will become more difficult to keep the disc at the center of the screen.
 Eventually, you will lose control of the disc.
 When it hits a wall at the edge of the screen, the trial ends and the disc will be moved back to the center of the screen.
 Try to keep the disc away from the walls for as long as possible on each trial.`,
];

const tutorialMobileSecond: TutorialPayload = [
  `This is the Focus Phase.
 This phase will last 5 minutes.
 The trial will begin at an easy level, and will increase to a level that should not be very difficult.
 Your task will be to focus on keeping the disc in the center of the screen, without letting it drift off center.
 If you lose control of the disc and it hits a wall, the disc will be moved back to the center of the screen and the task will continue.`,
];

export const MobileTutorials: DeviceTutorials = {
  0: tutorialMobileFirst,
  1: tutorialMobileSecond,
};
