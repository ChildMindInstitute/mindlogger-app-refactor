import { FlankerSettingsDto } from '../FlankerSettingsDto';

export const flankerWithStFxImages: FlankerSettingsDto = {
  general: {
    buttons: [
      {
        name: '',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/kQjEwPpwGMEb5JMUovN2F9.png',
      },
      {
        name: '',
        value: 1,
        image:
          'https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/16:9/w_2560%2Cc_limit/1521-WIRED-Cat.jpeg',
      },
    ],
    fixation: null ?? {
      duration: 500,
      alt: '-----',
      image: '',
      // image:
      //   'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    },
    instruction: `## General Instructions\n
You will see arrows presented at the center of the screen that point either to the left ‘<’ or right ‘>’.
Press the left button if the arrow is pointing to the left ‘<’ or press the right button if the arrow is pointing to the right ‘>’.
These arrows will appear in the center of a line of other items. Sometimes, these other items will be arrows pointing in the same direction, e.g.. ‘> > > > >’, or in the opposite direction, e.g. ‘< < > < <’.
Your job is to respond to the central arrow, no matter what direction the other arrows are pointing.
For example, you would press the left button for both ‘< < < < <’, and ‘> > < > >’ because the middle arrow points to the left.
Finally, in some trials dashes ‘ - ’ will appear beside the central arrow.
Again, respond only to the direction of the central arrow. Please respond as quickly and accurately as possible.`,
    stimulusTrials: [
      {
        text: '1.jpg',
        id: '1__jpg0',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/qupWT3WKPGuAYmZaPCi23V.jpeg',
      },
      {
        text: '3.jpg',
        id: '3__jpg1',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/5DC8wsj2eubpLhSDABPfh2.jpeg',
      },
      {
        text: '5.jpg',
        id: '5__jpg2',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/3uxihZWRjLVmke1NxWnHj3.jpeg',
      },
      {
        text: '7.jpg',
        id: '7__jpg3',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/wc28MYZ7Qy6gL7rWABKPJy.jpeg',
      },
      {
        text: '9.png',
        id: '9__png4',
        value: 0,
        image:
          'https://mindlogger-applet-contents.s3.amazonaws.com/image/xbtB2bQiVNsxMaUx7E43iV.png',
      },
    ],
  },
  practice: {
    threshold: 75,
    showFeedback: false,
    showSummary: false,
    stimulusDuration: 2000,
    randomizeOrder: true,
    instruction:
      '## Instructions\n\nNow you will have a chance to practice the task before moving on to the test phase. Remember to respond only to the central arrow ',
    blocks: [
      {
        name: 'block 1',
        order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
      },
    ],
  },
  test: {
    instruction:
      '## Test Instructions\n\nGood job on the practice blocks. You can now move on to the test blocks. You will do the same task as in the practice, responding to the direction of the central arrow. You will complete 3 blocks, each about 3-5 minutes long. You will have a short break in between these blocks ',
    showFeedback: true,
    showSummary: true,
    randomizeOrder: true,
    stimulusDuration: 1500,
    blocks: [
      {
        name: 'block 1',
        order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
      },
      {
        name: 'block 2',
        order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
      },
    ],
  },
};

// todo - remove after api integration and qa testing
/*
const FlankerWithStFxImages: any = {
  stimulusTrials: [
    {
      text: '1.jpg',
      id: '1__jpg0',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/qupWT3WKPGuAYmZaPCi23V.jpeg',
    },
    {
      text: '3.jpg',
      id: '3__jpg1',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/5DC8wsj2eubpLhSDABPfh2.jpeg',
    },
    {
      text: '5.jpg',
      id: '5__jpg2',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/3uxihZWRjLVmke1NxWnHj3.jpeg',
    },
    {
      text: '7.jpg',
      id: '7__jpg3',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/wc28MYZ7Qy6gL7rWABKPJy.jpeg',
    },
    {
      text: '9.png',
      id: '9__png4',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/xbtB2bQiVNsxMaUx7E43iV.png',
    },
  ],
  blocks: [
    {
      name: 'block 1',
      order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
    },
    {
      name: 'block 2',
      order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
    },
    {
      name: 'block 3',
      order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
    },
    {
      name: 'block 4',
      order: ['1__jpg0', '3__jpg1', '5__jpg2', '7__jpg3', '9__png4'],
    },
  ],
  buttons: [
    { text: 'Left', value: 0, image: '' },
    { text: 'Right', value: 1, image: '' },
  ],
  showFixation: true,
  showFeedback: false,
  showResults: true,
  samplingMethod: 'fixed-order',
  nextButton: 'Continue',
  sampleSize: 1,
  trialDuration: 2500,
  fixationDuration: 500,
  fixationScreen: {
    value: 'gfx100s_sample_01_thum.jpeg',
    image:
      'https://mindlogger-applet-contents.s3.amazonaws.com/image/6H1puzFNm6s6JxMMd2Xhry.png',
  },
  isLastTest: false,
  blockType: 'test',
  isFirstPractice: false,
  isLastPractice: false,
  minimumAccuracy: 0,
};
*/
