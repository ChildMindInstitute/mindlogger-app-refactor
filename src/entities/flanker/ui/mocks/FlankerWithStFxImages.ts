import { FlankerConfiguration } from '../../lib/types';

export const FlankerWithStFxImages: FlankerConfiguration = {
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
      'https://mindlogger-applet-contents.s3.amazonaws.com/image/3Q8dXGtKc129sWcdSmQwW4.jpeg',
  },
  isLastTest: false,
  blockType: 'test',
};
