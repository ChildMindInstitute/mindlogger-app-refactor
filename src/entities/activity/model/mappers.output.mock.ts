import { ActivityDetails } from '@entities/activity';
export const messageOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: false,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '14e31b68-22d8-1858-d681-b95200000001',
      inputType: 'Message',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen13',
      order: 1,
      question: 'Message.',
      timer: null,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const stackedRadioOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        addScores: false,
        addTooltip: false,
        dataMatrix: [
          {
            options: [
              {
                alert: null,
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 0,
              },
              {
                alert: null,
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 0,
              },
              {
                alert: null,
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 1,
              },
            ],
            rowId: '0469c218-54fd-410c-a57b-37a1b4381967',
          },
          {
            options: [
              {
                alert: null,
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 1,
              },
              {
                alert: null,
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 1,
              },
              {
                alert: null,
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 1,
              },
            ],
            rowId: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
          },
          {
            options: [
              {
                alert: null,
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 1,
              },
              {
                alert: null,
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 1,
              },
              {
                alert: null,
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 0,
              },
            ],
            rowId: 'f06025f5-53fd-4400-9276-dbfbef47a893',
          },
        ],
        options: [
          {
            id: '945550e6-977e-44cb-a25a-8e52afcda407',
            image: null,
            text: 'Option 1',
            tooltip: null,
          },
          {
            id: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
            image: null,
            text: 'Option 2',
            tooltip: null,
          },
          {
            id: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
            image: null,
            text: 'Option 3',
            tooltip: null,
          },
        ],
        randomizeOptions: false,
        rows: [
          {
            id: '0469c218-54fd-410c-a57b-37a1b4381967',
            rowImage: null,
            rowName: 'Item 1',
            tooltip: null,
          },
          {
            id: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
            rowImage: null,
            rowName: 'Item 2',
            tooltip: null,
          },
          {
            id: 'f06025f5-53fd-4400-9276-dbfbef47a893',
            rowImage: null,
            rowName: 'Item 3',
            tooltip: null,
          },
        ],
        setAlerts: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b66-22d8-1858-d681-b93c00000000',
      inputType: 'StackedRadio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen1',
      order: 0,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/u7WpUCzJizkE5GoAstGBWv.png =250x250)\r\n\r\nstacked radio",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const stackedSliderOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        addScores: false,
        rows: [
          {
            alerts: null,
            id: 'cf672d0e-3f3d-4c9c-90b8-110c7fa51703',
            label: 'Slider 1',
            leftImageUrl: null,
            leftTitle: 'Min',
            maxValue: 5,
            minValue: 1,
            rightImageUrl: null,
            rightTitle: 'Max',
          },
          {
            alerts: null,
            id: '9e58862c-45bd-451c-a362-891fad43b288',
            label: 'Slider 2',
            leftImageUrl: null,
            leftTitle: 'Min',
            maxValue: 5,
            minValue: 1,
            rightImageUrl: null,
            rightTitle: 'Max',
          },
          {
            alerts: null,
            id: 'f010db9b-7299-4767-a172-757a21d6a53e',
            label: 'Slider 3',
            leftImageUrl: null,
            leftTitle: 'Min',
            maxValue: 5,
            minValue: 1,
            rightImageUrl: null,
            rightTitle: 'Max',
          },
        ],
        setAlerts: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94000000000',
      inputType: 'StackedSlider',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen3',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/igwbKHEhog25n1qzGf9a6t.png =250x250)\r\n\r\nstacked slider",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const stackedCheckboxOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        addScores: false,
        addTooltip: false,
        dataMatrix: [
          {
            options: [
              {
                alert: null,
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
              },
              {
                alert: null,
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
              },
              {
                alert: null,
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
              },
            ],
            rowId: '2d3d0047-4cd0-491f-a2aa-13cae1ba736d',
          },
          {
            options: [
              {
                alert: null,
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
              },
              {
                alert: null,
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
              },
              {
                alert: null,
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
              },
            ],
            rowId: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
          },
          {
            options: [
              {
                alert: null,
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
              },
              {
                alert: null,
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
              },
              {
                alert: null,
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
              },
            ],
            rowId: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
          },
        ],
        options: [
          {
            id: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
            image: null,
            text: 'Option 1',
            tooltip: null,
          },
          {
            id: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
            image: null,
            text: 'Option 2',
            tooltip: null,
          },
          {
            id: '34855c27-f654-4709-b495-fd4ea2f2d039',
            image: null,
            text: 'Option 3',
            tooltip: null,
          },
        ],
        randomizeOptions: false,
        rows: [
          {
            id: '2d3d0047-4cd0-491f-a2aa-13cae1ba736d',
            rowImage: null,
            rowName: 'Item 1',
            tooltip: null,
          },
          {
            id: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
            rowImage: null,
            rowName: 'Item 2',
            tooltip: null,
          },
          {
            id: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
            rowImage: null,
            rowName: 'Item 3',
            tooltip: null,
          },
        ],
        setAlerts: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      inputType: 'StackedCheckbox',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen2',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/cCZtZynR1FGfiC6wfC5UCp.png =250x250)\r\n\r\nstacked checkbox",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const photoOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94200000000',
      inputType: 'Photo',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen4',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/xA3hfNxc3QwE1tnKqcLuW7.png =250x250)\r\n\r\nphoto",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const videoOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94400000000',
      inputType: 'Video',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen5',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/4Rahfpn2ARbDax78bZso5Z.png =250x250)\r\n\r\nvideo",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const timeRangeOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94600000000',
      inputType: 'TimeRange',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen6',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/fugsYaeXFkBf4uFZ4gtJkL.png =250x250)\r\n\r\ntime range",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const dateOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94800000000',
      inputType: 'Date',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen7',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/c8mp4fhRxSh3ArsLkFb7tq.png =250x250)\r\n\r\ndate",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const drawingOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        backgroundImageUrl: null,
        imageUrl: null,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94a00000000',
      inputType: 'DrawingTest',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen8',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/pbcpVTjSUKGybNARUBapMB.png =250x250)\r\n\r\ndrawing",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const audioOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        maxDuration: 300,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b67-22d8-1858-d681-b94c00000000',
      inputType: 'Audio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen9',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/m3y28SmkdVi5vSDQdb4xqz.png =250x250)\r\n\r\naudio record",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const geolocationOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: null,
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b68-22d8-1858-d681-b95000000000',
      inputType: 'Geolocation',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'Screen11',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/8pAt8gPMa1cCsNqDbusfCK.png =250x250)\r\n\r\ngeolocation",
      timer: 10000,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const audioPlayerOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: false,
      config: {
        file: 'https://mindlogger-applet-contents.s3.amazonaws.com/audio/418Uz2fzP1RA6s5Nr1bqTr.wav',
        playOnce: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b68-22d8-1858-d681-b95200000000',
      inputType: 'AudioPlayer',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: true,
      name: 'Screen12',
      order: 0,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/vVbeGEFRYhb7arQQciQzUY.png =250x250)\r\n\r\naudio stimulus",
      timer: null,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const audioPlayerWithAdditionalTextOutput: ActivityDetails = {
  description: 'All items',
  hasSummary: false,
  id: '64e31b66-22d8-1858-d681-b93200000000',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      additionalText: {
        required: true,
      },
      canBeReset: false,
      config: {
        file: 'https://mindlogger-applet-contents.s3.amazonaws.com/audio/418Uz2fzP1RA6s5Nr1bqTr.wav',
        playOnce: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '64e31b68-22d8-1858-d681-b95200000000',
      inputType: 'AudioPlayer',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: true,
      name: 'Screen12',
      order: 1,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/vVbeGEFRYhb7arQQciQzUY.png =250x250)\r\n\r\naudio stimulus",
      timer: null,
    },
  ],
  name: 'All items (header image)',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};

export const conditionalOutput: ActivityDetails = {
  description: '2 out of 3',
  hasSummary: false,
  id: 'd79bcaee-28e6-4f4c-b89c-e812b18aca46',
  image: '',
  isHidden: false,
  isReviewable: false,
  isSkippable: false,
  items: [
    {
      canBeReset: true,
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: '117c3a26-a3f8-449e-94d6-198b0c7280a8',
            image: null,
            isHidden: false,
            score: null,
            text: 'test',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '465efd87-b4d5-4d23-8348-365dd0f435ba',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_instructions',
      order: 1,
      question:
        'Durante las **++últimas 2 semanas++**, ¿qué tan seguido ha\ntenido molestias debido a los siguientes problemas?',
      timer: null,
    },
    {
      canBeReset: true,
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: '9a1f9632-b673-40ee-84ef-856bd035f602',
            image: null,
            isHidden: false,
            score: 0,
            text: 'ss',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '67fdc866-0e4b-40ae-a194-67c6bdaaab9a',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_01',
      order: 1,
      question: '++**quest',
      timer: null,
    },
    {
      canBeReset: true,
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: '8cb97b4c-1518-4375-9866-48c07da941ad',
            image: null,
            isHidden: false,
            score: 0,
            text: 'Ningún día',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: 'b9fab9c9-1849-4192-8f78-5b70d23d51d6',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_02',
      order: 1,
      question:
        'Durante las últimas 2 semanas… Se ha sentido decaído(a), deprimido(a) o sin esperanzas',
      timer: null,
    },
    {
      canBeReset: true,
      conditionalLogic: {
        conditions: [
          {
            activityItemName: 'phq9_01',
            payload: {
              optionValue: '2',
            },
            type: 'EQUAL_TO_OPTION',
          },
          {
            activityItemName: 'phq9_01',
            payload: {
              optionValue: '3',
            },
            type: 'EQUAL_TO_OPTION',
          },
          {
            activityItemName: 'phq9_02',
            payload: {
              optionValue: '2',
            },
            type: 'EQUAL_TO_OPTION',
          },
          {
            activityItemName: 'phq9_02',
            payload: {
              optionValue: '3',
            },
            type: 'EQUAL_TO_OPTION',
          },
        ],
        match: 'any',
      },
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: '5b1ab613-f405-4004-8c92-e64f21d1ca7a',
            image: null,
            isHidden: false,
            score: 0,
            text: 'Ningún día',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: 'bd2fc7f5-afae-42fb-b654-895b3a8ea636',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_03',
      order: 1,
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nHa tenido dificultad para quedarse o permanecer dormido(a), o ha dormido demasiado',
      timer: null,
    },
    {
      canBeReset: true,
      conditionalLogic: {
        conditions: [
          {
            activityItemName: 'phq9_01',
            payload: {
              optionValue: '2',
            },
            type: 'EQUAL_TO_OPTION',
          },
        ],
        match: 'any',
      },
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: '737d58ec-d34e-44c8-aada-012afc7e2366',
            image: null,
            isHidden: false,
            score: 0,
            text: 'Ningún día',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: '61411f69-b491-4a7c-a4cc-c05f762bcb2a',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_04',
      order: 1,
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSe ha sentido cansado(a) o con poca energía',
      timer: null,
    },
    {
      canBeReset: true,
      conditionalLogic: {
        conditions: [
          {
            activityItemName: 'phq9_01',
            payload: {
              optionValue: '2',
            },
            type: 'EQUAL_TO_OPTION',
          },
        ],
        match: 'any',
      },
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: 'c94be769-269c-458e-9d07-4eb2995bd5d8',
            image: null,
            isHidden: false,
            score: 0,
            text: 'Ningún día',
            tooltip: '',
            value: 0,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: 'e99dfe82-58ce-4395-b3eb-f7d5e3369fc1',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_05',
      order: 1,
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSin apetito o ha comido en exceso',
      timer: null,
    },
    {
      canBeReset: true,
      conditionalLogic: {
        conditions: [
          {
            activityItemName: 'phq9_02',
            payload: {
              optionValue: '3',
            },
            type: 'EQUAL_TO_OPTION',
          },
        ],
        match: 'any',
      },
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: 'd52d04d0-c5d5-458c-a725-1e9d505afb6a',
            image: null,
            isHidden: false,
            score: 3,
            text: 'Casi todos los días',
            tooltip: '',
            value: 3,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: 'b70a0f33-0d2f-4623-9491-45a3f73aa011',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_06',
      order: 2,
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSe ha sentido mal con usted mismo(a) – o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia',
      timer: null,
    },
    {
      canBeReset: true,
      conditionalLogic: {
        conditions: [
          {
            activityItemName: 'phq9_01',
            payload: {
              optionValue: '2',
            },
            type: 'EQUAL_TO_OPTION',
          },
          {
            activityItemName: 'phq9_02',
            payload: {
              optionValue: '3',
            },
            type: 'EQUAL_TO_OPTION',
          },
        ],
        match: 'any',
      },
      config: {
        addTooltip: false,
        autoAdvance: true,
        options: [
          {
            alert: null,
            color: null,
            id: 'e122da2d-25e7-45ec-9992-91ec18ee6db5',
            image: null,
            isHidden: false,
            score: 1,
            text: 'Varios días',
            tooltip: '',
            value: 1,
          },
        ],
        randomizeOptions: false,
        setAlerts: false,
        setPalette: false,
      },
      hasAlert: false,
      hasScore: false,
      hasTextResponse: false,
      hasTopNavigation: false,
      id: 'f69c68c7-9edb-4e19-90c5-7a3e35759f31',
      inputType: 'Radio',
      isAbleToMoveBack: true,
      isHidden: false,
      isSkippable: false,
      name: 'phq9_07',
      order: 2,
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nHa tenido dificultad para concentrarse en ciertas actividades, tales como leer el periódico o ver la televisión',
      timer: null,
    },
  ],
  name: 'PHQ-9',
  order: 2,
  responseIsEditable: true,
  scoreSettings: [],
  showAllAtOnce: false,
  splashScreen: '',
};
