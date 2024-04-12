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
    generateReport: false,
    showScoreSummary: false,
    reports: [],
  },
  scoreSettings: [],
  hasSummary: false,
};

export const stackedRadioInput = {
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
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
                value: 2,
              },
            ],
          },
          {
            rowId: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
                value: 2,
              },
            ],
          },
          {
            rowId: 'f06025f5-53fd-4400-9276-dbfbef47a893',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
                value: 2,
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
        addTokens: null,
      },
      name: 'Screen1',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '64e31b66-22d8-1858-d681-b93c00000000',
    },
  ],
};

export const stackedCheckboxInput = {
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
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
                value: 2,
              },
            ],
          },
          {
            rowId: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
                value: 2,
              },
            ],
          },
          {
            rowId: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: null,
                alert: null,
                value: 0,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
                value: 1,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
                value: 2,
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
        addTokens: null,
      },
      name: 'Screen2',
      isHidden: false,
      conditionalLogic: null,
      allowEdit: true,
      id: '64e31b66-22d8-1858-d681-b93e00000000',
    },
  ],
};

export const stackedSliderInput = {
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
            scores: [],
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
            scores: [],
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
            scores: [],
            alerts: null,
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94000000000',
    },
  ],
};

export const photoInput = {
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94200000000',
    },
  ],
};

export const videoInput = {
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94400000000',
    },
  ],
};

export const timeRangeInput = {
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94600000000',
    },
  ],
};

export const dateInput = {
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94800000000',
    },
  ],
};

export const drawingInput = {
  ...basicAppletDetails,
  items: [
    {
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/pbcpVTjSUKGybNARUBapMB.png =250x250)\r\n\r\ndrawing",
      responseType: 'drawing',
      responseValues: { drawingExample: null, drawingBackground: null },
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94a00000000',
    },
  ],
};

export const audioInput = {
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
      allowEdit: true,
      id: '64e31b67-22d8-1858-d681-b94c00000000',
    },
  ],
};

export const geoLocationInput = {
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
      allowEdit: true,
      id: '64e31b68-22d8-1858-d681-b95000000000',
    },
  ],
};
export const audioPlayerInput = {
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
      allowEdit: true,
      id: '64e31b68-22d8-1858-d681-b95200000000',
    },
  ],
};

export const stackedRadioOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b66-22d8-1858-d681-b93c00000000',
      name: 'Screen1',
      inputType: 'StackedRadio',
      config: {
        setAlerts: false,
        addTooltip: false,
        addScores: false,
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
                score: null,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
              },
            ],
          },
          {
            rowId: '3fbfb3e8-ad75-44d8-a7d1-33ea5059d9db',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: null,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
              },
            ],
          },
          {
            rowId: 'f06025f5-53fd-4400-9276-dbfbef47a893',
            options: [
              {
                optionId: '945550e6-977e-44cb-a25a-8e52afcda407',
                score: null,
                alert: null,
              },
              {
                optionId: '2e3bf074-f7f2-4a5e-927c-2dd17c93226a',
                score: null,
                alert: null,
              },
              {
                optionId: '7c362944-19df-4fa1-bbe7-13c1296cc96a',
                score: null,
                alert: null,
              },
            ],
          },
        ],
      },
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/u7WpUCzJizkE5GoAstGBWv.png =250x250)\r\n\r\nstacked radio",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const stackedCheckboxOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b66-22d8-1858-d681-b93e00000000',
      name: 'Screen2',
      inputType: 'StackedCheckbox',
      config: {
        setAlerts: false,
        addTooltip: false,
        addScores: false,
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
                score: null,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
              },
            ],
          },
          {
            rowId: '8c563eee-5ef5-4c8a-ac78-34f216a74da8',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: null,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
              },
            ],
          },
          {
            rowId: '7059de0f-f372-4766-bbbd-dc5df5ee2a37',
            options: [
              {
                optionId: 'bd75837a-5a2b-410d-ab3a-17bbf9278bd7',
                score: null,
                alert: null,
              },
              {
                optionId: '4f6e72b0-f78b-41e9-a134-f15eda0a65c9',
                score: null,
                alert: null,
              },
              {
                optionId: '34855c27-f654-4709-b495-fd4ea2f2d039',
                score: null,
                alert: null,
              },
            ],
          },
        ],
      },
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/cCZtZynR1FGfiC6wfC5UCp.png =250x250)\r\n\r\nstacked checkbox",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};
export const stackedSliderOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94000000000',
      name: 'Screen3',
      inputType: 'StackedSlider',
      config: {
        setAlerts: false,
        addScores: false,
        rows: [
          {
            leftTitle: 'Min',
            rightTitle: 'Max',
            leftImageUrl: null,
            rightImageUrl: null,
            minValue: 1,
            maxValue: 5,
            id: 'cf672d0e-3f3d-4c9c-90b8-110c7fa51703',
            label: 'Slider 1',
            alerts: null,
          },
          {
            leftTitle: 'Min',
            rightTitle: 'Max',
            leftImageUrl: null,
            rightImageUrl: null,
            minValue: 1,
            maxValue: 5,
            id: '9e58862c-45bd-451c-a362-891fad43b288',
            label: 'Slider 2',
            alerts: null,
          },
          {
            leftTitle: 'Min',
            rightTitle: 'Max',
            leftImageUrl: null,
            rightImageUrl: null,
            minValue: 1,
            maxValue: 5,
            id: 'f010db9b-7299-4767-a172-757a21d6a53e',
            label: 'Slider 3',
            alerts: null,
          },
        ],
      },
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/igwbKHEhog25n1qzGf9a6t.png =250x250)\r\n\r\nstacked slider",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const photoOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94200000000',
      name: 'Screen4',
      inputType: 'Photo',
      config: null,
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/xA3hfNxc3QwE1tnKqcLuW7.png =250x250)\r\n\r\nphoto",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const videoOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94400000000',
      name: 'Screen5',
      inputType: 'Video',
      config: null,
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/4Rahfpn2ARbDax78bZso5Z.png =250x250)\r\n\r\nvideo",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const timeRangeOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94600000000',
      name: 'Screen6',
      inputType: 'TimeRange',
      config: null,
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/fugsYaeXFkBf4uFZ4gtJkL.png =250x250)\r\n\r\ntime range",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const dateOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94800000000',
      name: 'Screen7',
      inputType: 'Date',
      timer: 10000,
      config: null,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/c8mp4fhRxSh3ArsLkFb7tq.png =250x250)\r\n\r\ndate",
      isHidden: false,
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
    },
  ],
};

export const drawingOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94a00000000',
      name: 'Screen8',
      inputType: 'DrawingTest',
      config: { imageUrl: null, backgroundImageUrl: null },
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/pbcpVTjSUKGybNARUBapMB.png =250x250)\r\n\r\ndrawing",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const audioOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b67-22d8-1858-d681-b94c00000000',
      name: 'Screen9',
      inputType: 'Audio',
      config: { maxDuration: 300 },
      timer: 10000,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/m3y28SmkdVi5vSDQdb4xqz.png =250x250)\r\n\r\naudio record",
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};

export const geolocationOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b68-22d8-1858-d681-b95000000000',
      name: 'Screen11',
      inputType: 'Geolocation',
      timer: 10000,
      config: null,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/8pAt8gPMa1cCsNqDbusfCK.png =250x250)\r\n\r\ngeolocation",
      isHidden: false,
      isSkippable: false,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: true,
      hasTopNavigation: false,
    },
  ],
};

export const audioPlayerOutput = {
  ...basicAppletDetails,
  items: [
    {
      id: '64e31b68-22d8-1858-d681-b95200000000',
      name: 'Screen12',
      inputType: 'AudioPlayer',
      config: {
        file: 'https://mindlogger-applet-contents.s3.amazonaws.com/audio/418Uz2fzP1RA6s5Nr1bqTr.wav',
        playOnce: false,
      },
      timer: null,
      question:
        "\r\n\r\n![''](https://mindlogger-applet-contents.s3.amazonaws.com/image/vVbeGEFRYhb7arQQciQzUY.png =250x250)\r\n\r\naudio stimulus",
      isSkippable: true,
      hasAlert: false,
      hasScore: false,
      isAbleToMoveBack: true,
      hasTextResponse: false,
      canBeReset: false,
      hasTopNavigation: false,
      isHidden: false,
    },
  ],
};
