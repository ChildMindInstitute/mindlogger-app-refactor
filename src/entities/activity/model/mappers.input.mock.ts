import { ActivityDto } from '@app/shared/api/services/IActivityService';

const basicAppletDetails = {
  id: '64e31b66-22d8-1858-d681-b93200000000',
  name: 'All items (header image)',
  description: 'All items',
  splashScreen: '',
  image: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  isHidden: false,
  responseIsEditable: true,
  order: 2,
  scoresAndReports: {
    showScoreSummary: false,
    reports: [],
  },
  scoreSettings: [],
  hasSummary: false,
  timer: null,
};

export const stackedRadioInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/u7WpUCzJizkE5GoAstGBWv.png =250x250)\r\n\r\nstacked radio",
      responseType: 'singleSelectRows',
      responseValues: {
        rows: [
          {
            id: '0469c218-54fd-410c-a57b-37a1b4381967',
            rowName: 'Item 1',
            rowImage: null,
            tooltip: null,
          },
          {
            id: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
            rowName: 'Item 2',
            rowImage: null,
            tooltip: null,
          },
          {
            id: 'f06025f5-53fd-4400-9276-dbfbef47a893',
            rowName: 'Item 3',
            rowImage: null,
            tooltip: null,
          },
        ],
        options: [
          {
            id: '945550e6-977e-44cb-a25a-8e52afcda407',
            text: 'Option 1',
            image: null,
            tooltip: null,
          },
          {
            id: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
            text: 'Option 2',
            image: null,
            tooltip: null,
          },
          {
            id: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
            text: 'Option 3',
            image: null,
            tooltip: null,
          },
        ],
        dataMatrix: [
          {
            rowId: '0469c218-54fd-410c-a57b-37a1b4381967',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 0,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 0,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 1,
                alert: null,
              },
            ],
          },
          {
            rowId: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 1,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 1,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 1,
                alert: null,
              },
            ],
          },
          {
            rowId: 'f06025f5-53fd-4400-9276-dbfbef47a893',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: 1,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: 1,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: 0,
                alert: null,
              },
            ],
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        timer: 10,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        randomizeOptions: false,
      },
      name: 'Screen1',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93c00000000',
      order: 0,
      timer: null,
    },
  ],
};

export const stackedCheckboxInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/cCZtZynR1FGfiC6wfC5UCp.png =250x250)\r\n\r\nstacked checkbox",
      responseType: 'multiSelectRows',
      responseValues: {
        rows: [
          {
            id: '2d3d0047-4cd0-491f-a2aa-13cae1ba736d',
            rowName: 'Item 1',
            rowImage: null,
            tooltip: null,
          },
          {
            id: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
            rowName: 'Item 2',
            rowImage: null,
            tooltip: null,
          },
          {
            id: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
            rowName: 'Item 3',
            rowImage: null,
            tooltip: null,
          },
        ],
        options: [
          {
            id: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
            text: 'Option 1',
            image: null,
            tooltip: null,
          },
          {
            id: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
            text: 'Option 2',
            image: null,
            tooltip: null,
          },
          {
            id: '34855c27-f654-4709-b495-fd4ea2f2d039',
            text: 'Option 3',
            image: null,
            tooltip: null,
          },
        ],
        dataMatrix: [
          {
            rowId: '2d3d0047-4cd0-491f-a2aa-13cae1ba736d',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
                alert: null,
              },
            ],
          },
          {
            rowId: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
                alert: null,
              },
            ],
          },
          {
            rowId: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: 0,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: 0,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: 0,
                alert: null,
              },
            ],
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        timer: 10,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        randomizeOptions: false,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      timer: null,
      order: 1,
    },
  ],
};

export const stackedSliderInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/igwbKHEhog25n1qzGf9a6t.png =250x250)\r\n\r\nstacked slider",
      responseType: 'sliderRows',
      responseValues: {
        rows: [
          {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 1,
            maxValue: 5,
            minImage: null,
            maxImage: null,
            alerts: null,
            id: 'cf672d0e-3f3d-4c9c-90b8-110c7fa51703',
            label: 'Slider 1',
          },
          {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 1,
            maxValue: 5,
            minImage: null,
            maxImage: null,
            alerts: null,
            id: '9e58862c-45bd-451c-a362-891fad43b288',
            label: 'Slider 2',
          },
          {
            minLabel: 'Min',
            maxLabel: 'Max',
            minValue: 1,
            maxValue: 5,
            minImage: null,
            maxImage: null,
            alerts: [
              {
                value: 1,
                minValue: 0,
                maxValue: 10,
                alert: 'Some alert',
              },
              {
                value: 2,
                minValue: 5,
                maxValue: 7,
                alert: 'Some alert 2',
              },
            ],
            id: 'f010db9b-7299-4767-a172-757a21d6a53e',
            label: 'Slider 3',
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        addScores: false,
        setAlerts: false,
        timer: 10,
      },
      name: 'Screen3',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94000000000',
      order: 1,
      timer: null,
    },
  ],
};

export const photoInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/xA3hfNxc3QwE1tnKqcLuW7.png =250x250)\r\n\r\nphoto",
      responseType: 'photo',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen4',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94200000000',
      order: 1,
      timer: null,
    },
  ],
};

export const videoInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/4Rahfpn2ARbDax78bZso5Z.png =250x250)\r\n\r\nvideo",
      responseType: 'video',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen5',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94400000000',
      order: 1,
      timer: null,
    },
  ],
};

export const timeRangeInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/fugsYaeXFkBf4uFZ4gtJkL.png =250x250)\r\n\r\ntime range",
      responseType: 'timeRange',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen6',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94600000000',
      order: 1,
      timer: 20,
    },
  ],
};

export const dateInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/c8mp4fhRxSh3ArsLkFb7tq.png =250x250)\r\n\r\ndate",
      responseType: 'date',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen7',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94800000000',
      order: 1,
      timer: null,
    },
  ],
};

export const drawingInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/pbcpVTjSUKGybNARUBapMB.png =250x250)\r\n\r\ndrawing",
      responseType: 'drawing',
      responseValues: {
        drawingExample: null,
        drawingBackground: null,
        proportion: { enabled: false },
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
        removeUndoButton: false,
        navigationToTop: false,
      },
      name: 'Screen8',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94a00000000',
      order: 1,
      timer: null,
    },
  ],
};

export const audioInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/m3y28SmkdVi5vSDQdb4xqz.png =250x250)\r\n\r\naudio record",
      responseType: 'audio',
      responseValues: { maxDuration: 300 },
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen9',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94c00000000',
      timer: null,
      order: 1,
    },
  ],
};

export const geoLocationInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/8pAt8gPMa1cCsNqDbusfCK.png =250x250)\r\n\r\ngeolocation",
      responseType: 'geolocation',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen11',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b68-22d8-1858-d681-b95000000000',
      order: 1,
      timer: null,
    },
  ],
};

export const audioPlayerInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/vVbeGEFRYhb7arQQciQzUY.png =250x250)\r\n\r\naudio stimulus",
      responseType: 'audioPlayer',
      responseValues: {
        file: 'https://mindlogger-applet-contents.s3.amazonaws.com/audio/418Uz2fzP1RA6s5Nr1bqTr.wav',
      },
      config: {
        removeBackButton: false,
        skippableItem: true,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        playOnce: false,
      },
      name: 'Screen12',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b68-22d8-1858-d681-b95200000000',
      order: 0,
      timer: null,
    },
  ],
};

export const messageInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question: 'Message.',
      responseType: 'message',
      config: {
        removeBackButton: false,
        timer: null,
      },
      name: 'Screen13',
      isHidden: false,
      conditionalLogic: null,
      id: '14e31b68-22d8-1858-d681-b95200000001',
      order: 1,
      timer: null,
      responseValues: null,
    },
  ],
};

export const audioPlayerWithAdditionalTextInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/vVbeGEFRYhb7arQQciQzUY.png =250x250)\r\n\r\naudio stimulus",
      responseType: 'audioPlayer',
      responseValues: {
        file: 'https://mindlogger-applet-contents.s3.amazonaws.com/audio/418Uz2fzP1RA6s5Nr1bqTr.wav',
      },
      config: {
        removeBackButton: false,
        skippableItem: true,
        additionalResponseOption: {
          textInputOption: true,
          textInputRequired: true,
        },
        playOnce: false,
      },
      name: 'Screen12',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b68-22d8-1858-d681-b95200000000',
      timer: null,
      order: 1,
    },
  ],
};

export const conditionalInput: ActivityDto = {
  id: 'd79bcaee-28e6-4f4c-b89c-e812b18aca46',
  name: 'PHQ-9',
  description: '2 out of 3',
  splashScreen: '',
  image: '',
  showAllAtOnce: false,
  isSkippable: false,
  isReviewable: false,
  isHidden: false,
  responseIsEditable: true,
  order: 2,
  items: [
    {
      question:
        'Durante las **++últimas 2 semanas++**, ¿qué tan seguido ha\ntenido molestias debido a los siguientes problemas?',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: '117c3a26-a3f8-449e-94d6-198b0c7280a8',
            text: 'test',
            image: null,
            score: null,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: 'Some alert',
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_instructions',
      isHidden: false,
      conditionalLogic: null,
      id: '465efd87-b4d5-4d23-8348-365dd0f435ba',
    },
    {
      question: '++**quest',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: '9a1f9632-b673-40ee-84ef-856bd035f602',
            text: 'ss',
            image: null,
            score: 0,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_01',
      isHidden: false,
      conditionalLogic: null,
      id: '67fdc866-0e4b-40ae-a194-67c6bdaaab9a',
    },
    {
      question:
        'Durante las últimas 2 semanas… Se ha sentido decaído(a), deprimido(a) o sin esperanzas',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: '8cb97b4c-1518-4375-9866-48c07da941ad',
            text: 'Ningún día',
            image: null,
            score: 0,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_02',
      isHidden: false,
      conditionalLogic: null,
      id: 'b9fab9c9-1849-4192-8f78-5b70d23d51d6',
    },
    {
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nHa tenido dificultad para quedarse o permanecer dormido(a), o ha dormido demasiado',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: '5b1ab613-f405-4004-8c92-e64f21d1ca7a',
            text: 'Ningún día',
            image: null,
            score: 0,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_03',
      isHidden: false,
      conditionalLogic: {
        match: 'any',
        conditions: [
          {
            itemName: 'phq9_01',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '2' },
          },
          {
            itemName: 'phq9_01',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '3' },
          },
          {
            itemName: 'phq9_02',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '2' },
          },
          {
            itemName: 'phq9_02',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '3' },
          },
        ],
      },
      id: 'bd2fc7f5-afae-42fb-b654-895b3a8ea636',
    },
    {
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSe ha sentido cansado(a) o con poca energía',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: '737d58ec-d34e-44c8-aada-012afc7e2366',
            text: 'Ningún día',
            image: null,
            score: 0,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_04',
      isHidden: false,
      conditionalLogic: {
        match: 'any',
        conditions: [
          {
            itemName: 'phq9_01',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '2' },
          },
        ],
      },
      id: '61411f69-b491-4a7c-a4cc-c05f762bcb2a',
    },
    {
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSin apetito o ha comido en exceso',
      responseType: 'singleSelect',
      order: 1,
      timer: null,
      responseValues: {
        options: [
          {
            id: 'c94be769-269c-458e-9d07-4eb2995bd5d8',
            text: 'Ningún día',
            image: null,
            score: 0,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 0,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_05',
      isHidden: false,
      conditionalLogic: {
        match: 'any',
        conditions: [
          {
            itemName: 'phq9_01',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '2' },
          },
        ],
      },
      id: 'e99dfe82-58ce-4395-b3eb-f7d5e3369fc1',
    },
    {
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nSe ha sentido mal con usted mismo(a) – o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia',
      responseType: 'singleSelect',
      order: 2,
      timer: null,
      responseValues: {
        options: [
          {
            id: 'd52d04d0-c5d5-458c-a725-1e9d505afb6a',
            text: 'Casi todos los días',
            image: null,
            score: 3,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 3,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_06',
      isHidden: false,
      conditionalLogic: {
        match: 'any',
        conditions: [
          {
            itemName: 'phq9_02',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '3' },
          },
        ],
      },
      id: 'b70a0f33-0d2f-4623-9491-45a3f73aa011',
    },
    {
      question:
        '++**Durante las últimas 2 semanas...**++  \n\nHa tenido dificultad para concentrarse en ciertas actividades, tales como leer el periódico o ver la televisión',
      responseType: 'singleSelect',
      order: 2,
      timer: null,
      responseValues: {
        options: [
          {
            id: 'e122da2d-25e7-45ec-9992-91ec18ee6db5',
            text: 'Varios días',
            image: null,
            score: 1,
            tooltip: '',
            isHidden: false,
            color: null,
            alert: null,
            value: 1,
          },
        ],
      },
      config: {
        removeBackButton: false,
        skippableItem: false,
        randomizeOptions: false,
        timer: null,
        addScores: true,
        setAlerts: false,
        addTooltip: false,
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        autoAdvance: true,
        portraitLayout: false,
      },
      name: 'phq9_07',
      isHidden: false,
      conditionalLogic: {
        match: 'any',
        conditions: [
          {
            itemName: 'phq9_01',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '2' },
          },
          {
            itemName: 'phq9_02',
            type: 'EQUAL_TO_OPTION',
            payload: { optionValue: '3' },
          },
        ],
      },
      id: 'f69c68c7-9edb-4e19-90c5-7a3e35759f31',
    },
  ],
  scoresAndReports: {
    showScoreSummary: true,
    reports: [
      {
        itemsScore: ['one'],
        type: 'score',
        id: '1',
        name: 'name',
        calculationType: 'sum',
        conditionalLogic: [
          {
            flagScore: true,
            id: '1',
            name: 'name',
            match: 'any',
            conditions: [
              {
                itemName: 'one',
                type: 'GREATER_THAN',
                payload: {
                  value: 1,
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export const timeInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question: '\r\n\r\ntime',
      responseType: 'time',
      responseValues: null,
      config: {
        removeBackButton: false,
        skippableItem: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        timer: 10,
      },
      name: 'Screen6',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b67-22d8-1858-d681-b94600000000',
      order: 1,
      timer: 20,
    },
  ],
};

export const checkboxInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question: 'Checkbox',
      responseType: 'multiSelect',
      responseValues: {
        options: [
          {
            id: 'string',
            text: 'string',
            image: null,
            score: null,
            color: null,
            tooltip: 'string',
            value: 1,
            isNoneAbove: true,
            isHidden: false,
            alert: null,
          },
        ],
      },
      config: {
        setPalette: false,
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: false,
        timer: 10,
        addScores: false,
        setAlerts: false,
        addTooltip: false,
        randomizeOptions: false,
        portraitLayout: false,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      timer: null,
      order: 1,
    },
  ],
};

export const numberSelectInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question: 'NumberSelect',
      responseType: 'numberSelect',
      responseValues: {
        minValue: 0,
        maxValue: 100,
      },
      config: {
        additionalResponseOption: {
          textInputOption: false,
          textInputRequired: false,
        },
        removeBackButton: false,
        skippableItem: false,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      timer: null,
      order: 1,
    },
  ],
};

export const sliderInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      timer: null,
      question: 'Slider',
      responseType: 'slider',
      responseValues: {
        minLabel: 'min label',
        maxLabel: 'max label',
        minImage: null,
        maxImage: null,
        minValue: 0,
        maxValue: 10,
        alerts: [
          {
            value: 1,
            minValue: 0,
            maxValue: 10,
            alert: 'Some alert',
          },
          {
            value: 2,
            minValue: 5,
            maxValue: 7,
            alert: 'Some alert 2',
          },
        ],
        scores: [0, 1],
      },
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
        showTickMarks: true,
        showTickLabels: false,
        continuousSlider: true,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      order: 1,
    },
  ],
};

export const textInput: ActivityDto = {
  ...basicAppletDetails,
  items: [
    {
      question: 'TextInput',
      responseType: 'text',
      responseValues: null,
      config: {
        timer: null,
        maxResponseLength: 20,
        responseDataIdentifier: false,
        correctAnswerRequired: true,
        correctAnswer: 'correct',
        numericalResponseRequired: false,
        removeBackButton: false,
        skippableItem: false,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      timer: null,
      order: 1,
    },
  ],
};
