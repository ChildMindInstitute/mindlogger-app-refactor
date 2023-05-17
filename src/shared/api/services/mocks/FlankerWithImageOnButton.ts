// todo - remove after api integration and qa testing

export const FlankerWithImageOnButton: any = {
  stimulusTrials: [
    {
      text: '2.jpg',
      id: '2__jpg0',
      value: 0,
      image:
        'https://post.healthline.com/wp-content/uploads/2020/08/different-berries-birdview-thumb.jpg',
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
      value: 1,
      image:
        'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpghttps://mindlogger-applet-contents.s3.amazonaws.com/image/c9TPo542sB6pvr6MbWbKbi.jpeg',
    },
    {
      text: '3.jpg',
      id: '3__jpg3',
      value: 1,
      image:
        'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    {
      text: '1.jpg',
      id: '1__jpg4',
      value: 0,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Berberis_thunbergii_berries.jpg/800px-Berberis_thunbergii_berries.jpg',
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
      value: 1,
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm8ErlMlPdnS5zbhJ2KL339H-cCsjrxjMl8A&usqp=CAU',
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
      value: 1,
      image:
        'https://images.hindustantimes.com/img/2022/08/07/1600x900/cat_1659882617172_1659882628989_1659882628989.jpg',
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
    {
      text: '',
      value: 1,
      image:
        'https://media.wired.co.uk/photos/60c8730fa81eb7f50b44037e/16:9/w_2560%2Cc_limit/1521-WIRED-Cat.jpeg',
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
  isFirstPractice: false,
  isLastTest: false,
};
