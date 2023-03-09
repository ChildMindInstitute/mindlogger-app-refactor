import { FlankerConfiguration } from '../../lib/types';

export const FlankerWithImageOnButton: FlankerConfiguration = {
  stimulusTrials: [
    {
      text: '2.jpg',
      id: '2__jpg0',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/pjaX586RbCJpGLGv97dpKv.jpeg',
    },
    {
      text: '8.jpg',
      id: '8__jpg1',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/6m1aHByDXLDiKRZQSSyiSE.jpeg',
    },
    {
      text: '6.jpg',
      id: '6__jpg2',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/c9TPo542sB6pvr6MbWbKbi.jpeg',
    },
    {
      text: '3.jpg',
      id: '3__jpg3',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/4ZCcMcXpCmiFxcABK5hUZg.jpeg',
    },
    {
      text: '1.jpg',
      id: '1__jpg4',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/prAJaxvsxFtfAJRxs8T2nh.jpeg',
    },
    {
      text: '9.png',
      id: '9__png5',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/m2iAZhkpQTjr1dizsxaZzH.png',
    },
    {
      text: '4.jpg',
      id: '4__jpg6',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/3PTea5yvZCzPiswFFtpyYy.jpeg',
    },
    {
      text: '10.jpg',
      id: '10__jpg7',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/svrSKkNUx5yoNrsEhPHkfr.jpeg',
    },
    {
      text: '5.jpg',
      id: '5__jpg8',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/sKniF6Z1zeU2jyZrGkwXSe.jpeg',
    },
    {
      text: '7.jpg',
      id: '7__jpg9',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/24SmY2diFkFQrkzztCVnZY.jpeg',
    },
  ],
  blocks: [
    {
      name: 'block 1',
      order: ['1__jpg4', '3__jpg3', '5__jpg8', '7__jpg9', '9__png5'],
    },
    {
      name: 'block 2',
      order: ['1__jpg4', '3__jpg3', '5__jpg8', '7__jpg9', '9__png5'],
    },
    {
      name: 'block 3',
      order: ['1__jpg4', '3__jpg3', '5__jpg8', '7__jpg9', '9__png5'],
    },
    {
      name: 'block 4',
      order: ['1__jpg4', '3__jpg3', '5__jpg8', '7__jpg9', '9__png5'],
    },
  ],
  buttons: [
    {
      text: '',
      value: 0,
      image:
        'https://mindlogger-applet-contents.s3.amazonaws.com/image/kQjEwPpwGMEb5JMUovN2F9.png',
    },
  ],
  showFixation: true,
  showFeedback: true,
  showResults: true,
  samplingMethod: 'fixed-order',
  nextButton: 'OK',
  sampleSize: 1,
  trialDuration: 5000,
  fixationDuration: 1000,
  fixationScreen: {
    value: 'Без названия.png',
    image:
      'https://mindlogger-applet-contents.s3.amazonaws.com/image/6H1puzFNm6s6JxMMd2Xhry.png',
  },
  minimumAccuracy: 100,
  blockType: 'practice',
  isLastPractice: false,
};
