import {
  collectMarkdownImageUrls,
  collectAppletRecordImageUrls,
  collectAppletDetailsImageUrls,
  collectActivityDetailsImageUrls,
} from './collectImageUrls';

describe('Image URL Collection Functions', () => {
  const sampleApplet = {
    displayName: 'Notif 1',
    description: '',
    about: '',
    image:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/68dff67f-47af-4ba9-adec-9440077b0e3d/IMAGE%202.png',
    watermark:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/0e06365a-acc7-4db9-b7fc-8a0017a2354f/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
    themeId: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
    link: null,
    requireLogin: null,
    pinnedAt: null,
    retentionPeriod: null,
    retentionType: null,
    streamEnabled: false,
    reportServerIp: '',
    reportPublicKey: '',
    reportRecipients: [],
    reportIncludeUserId: false,
    reportIncludeCaseId: false,
    reportEmailBody: 'Please see the report attached to this email.',
    encryption: {
      publicKey: '[59]',
      prime: '[91]',
      base: '[2]',
      accountId: '2923f4a9-20ef-4995-a340-251d96ff3082',
    },
    id: 'a607c45a-4526-4317-be3c-b7eef337f11d',
    version: '5.0.0',
    createdAt: '2023-11-27T09:35:48.610846',
    updatedAt: '2023-12-29T10:12:24.689874',
    isPublished: false,
    theme: {
      name: 'Default',
      logo: 'https://media-dev.cmiml.net/mindlogger/content/some-logo.png',
      backgroundImage:
        'https://media-dev.cmiml.net/mindlogger/content/some-backgroundImage.png',
      primaryColor: '#0067a0',
      secondaryColor: '#fff',
      tertiaryColor: '#404040',
      id: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
      public: true,
      allowRename: true,
    },
  };

  const sampleActivity = {
    id: '52ee0b2e-9e9a-4145-9b2f-2ca7ac5a66ad',
    name: 'Activity0000 (1)',
    description: 'ASASD',
    splashScreen:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c26556ef-ef83-4782-9397-ea017a534e1c/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
    image:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c22ba829-ad08-4a7c-bbe6-9fd5a719f7e3/IMAGE%202.png',
    showAllAtOnce: false,
    isSkippable: false,
    isReviewable: false,
    isHidden: false,
    responseIsEditable: true,
    order: 1,
    items: [
      {
        question: 'daadda',
        responseType: 'singleSelect',
        responseValues: {
          paletteName: null,
          options: [
            {
              id: '258c0ed4-abe5-41eb-bd10-493fdf91d2f4',
              text: 'dsdsds',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a0f92bce-f866-4fe8-941c-f45e6e742438/Screenshot%202023-11-29%20at%2016.20.51.png',
              score: null,
              tooltip: null,
              isHidden: false,
              color: null,
              alert: null,
              value: 0,
            },
            {
              id: 'd8f639df-2259-476b-a342-fea6f6f090f5',
              text: 'ddddd',
              image: null,
              score: null,
              tooltip: null,
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
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          setPalette: false,
          addTokens: null,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'Item',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: 'cc5a8d67-16ba-4efe-8aae-6e614b7a20fb',
      },
      {
        question: 'assasa',
        responseType: 'multiSelect',
        responseValues: {
          paletteName: null,
          options: [
            {
              id: '59526da3-3627-4b88-b1c9-53dd413407be',
              text: '32323',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/2872f145-ecde-4c82-951f-4dc91c951f74/Screenshot%202023-12-21%20at%2013.15.05.png',
              score: null,
              tooltip: null,
              isHidden: false,
              color: null,
              alert: null,
              value: 0,
            },
            {
              id: '7f0c3bdb-f124-4c9f-a5dc-b19b350f34eb',
              text: '4455',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a22e156f-e878-4582-a6d0-2667935633ef/Screenshot%202023-11-29%20at%2016.20.51.png',
              score: null,
              tooltip: null,
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
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          setPalette: false,
          addTokens: null,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
        },
        name: 'Itemsas',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '69cc803a-3e86-46fc-a886-64310947e3c1',
      },
      {
        question: 'asfasfas',
        responseType: 'slider',
        responseValues: {
          minLabel: 'asdsadads',
          maxLabel: 'dasdsa',
          minValue: 0,
          maxValue: 5,
          minImage:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/655bf5dd-2a29-4e80-977d-1325811bd93d/Screenshot%202023-12-21%20at%2013.15.05.png',
          maxImage:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/deac0b73-c095-4dbc-bdb6-21c54604cda4/Screenshot%202023-12-28%20at%2013.25.47.png',
          scores: null,
          alerts: null,
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          addScores: false,
          setAlerts: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
          showTickMarks: false,
          showTickLabels: false,
          continuousSlider: false,
          timer: 0,
        },
        name: 'Item3523532',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '25e853fc-4790-4717-86fb-c028efff43cc',
      },
      {
        question: 'asfasfas',
        responseType: 'slider',
        responseValues: {
          minLabel: 'asdsadads',
          maxLabel: 'dasdsa',
          minValue: 0,
          maxValue: 5,
          minImage:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/655bf5dd-2a29-4e80-977d-1325811bd93d/Screenshot%202023-12-21%20at%2013.15.05.png',
          maxImage: null,
          scores: null,
          alerts: null,
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          addScores: false,
          setAlerts: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
          showTickMarks: false,
          showTickLabels: false,
          continuousSlider: false,
          timer: 0,
        },
        name: 'Item3523532_1',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: 'c54c89fe-d3e6-4f81-9375-35ee1443cfa3',
      },
      {
        question: 'dsadasdasdas',
        responseType: 'drawing',
        responseValues: {
          drawingExample:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d46db44f-2753-4835-857f-417ceda9ee92/IMAGE%202.png',
          drawingBackground:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/add2820e-9a15-44d9-9b2e-55308d7416b3/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
          timer: 0,
          removeUndoButton: false,
          navigationToTop: false,
        },
        name: 'Itemasdadsdsa',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '6d4dfbef-13d8-4e35-a71e-e4f2d4bddc3a',
      },
      {
        question: 'dsadasdasdas',
        responseType: 'drawing',
        responseValues: {
          drawingExample: null,
          drawingBackground:
            'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/add2820e-9a15-44d9-9b2e-55308d7416b3/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          additionalResponseOption: {
            textInputOption: false,
            textInputRequired: false,
          },
          timer: 0,
          removeUndoButton: false,
          navigationToTop: false,
        },
        name: 'Itemasdadsdsa_1',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '2247158e-ec38-4229-ab34-7369d48b1ff1',
      },
      {
        question: 'Itemrowsl',
        responseType: 'sliderRows',
        responseValues: {
          rows: [
            {
              minLabel: '',
              maxLabel: '',
              minValue: 2,
              maxValue: 5,
              minImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/2c6899fb-8b40-4be7-be00-6ace066912d0/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
              maxImage: null,
              scores: null,
              alerts: null,
              id: 'e98d88c1-8483-4aeb-96dc-942750267ca5',
              label: 'Sl lab-0',
            },
            {
              minLabel: '',
              maxLabel: '',
              minValue: 1,
              maxValue: 5,
              minImage: null,
              maxImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d99adefb-7eb2-43eb-9256-a969a398aab9/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
              scores: null,
              alerts: null,
              id: 'dae288af-5465-4b3b-8492-647c81ce559a',
              label: 'Sl 1',
            },
            {
              minLabel: '',
              maxLabel: '',
              minValue: 1,
              maxValue: 5,
              minImage: null,
              maxImage: null,
              scores: null,
              alerts: null,
              id: '40c4d6ad-f2ab-4736-8264-f6a41bbc641c',
              label: 'Slider lab',
            },
          ],
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          addScores: false,
          setAlerts: false,
          timer: 0,
        },
        name: 'Itemrowsl',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: 'cac9b716-e7d9-48c7-9d95-11d882764d33',
      },
      {
        question: 'gsgassagas',
        responseType: 'singleSelectRows',
        responseValues: {
          rows: [
            {
              id: '1bb403cc-6ee2-40bd-9de9-dcd9d2f6b1e4',
              rowName: 'row1',
              rowImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/b437b176-c858-4ba5-8504-bca555ebf627/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
            {
              id: '72afd526-9a75-412f-b090-acd4d9503077',
              rowName: 'row12',
              rowImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d8518307-e9a5-4fea-9450-33c685e74ec3/625dea55-f558-4352-b40f-5c88e5530cd0-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
            {
              id: '19c4f5a7-4628-4d90-b8f6-de037b399aa2',
              rowName: 'row14',
              rowImage: null,
              tooltip: null,
            },
          ],
          options: [
            {
              id: '4575abf2-5575-44e0-bb8f-3da9a699326f',
              text: 'opt1352',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/168d9049-28eb-43a9-93a3-006e24d9d3c5/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
            {
              id: 'c60e638f-4003-45ce-bc7f-e0183709f2b1',
              text: 'opt16457',
              image: null,
              tooltip: null,
            },
          ],
          dataMatrix: null,
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          addTokens: null,
        },
        name: 'Itemdgsaassa',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '6a846e2f-4d79-409d-845e-d80043b0bbab',
      },
      {
        question: '2532agsdvagds g',
        responseType: 'multiSelectRows',
        responseValues: {
          rows: [
            {
              id: 'c9738cd6-9f8d-4713-b63f-bf5ee132c271',
              rowName: 'row1352',
              rowImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/07aec1f7-430b-4aa0-a1bf-621790a68902/IMAGE%202.png',
              tooltip: null,
            },
            {
              id: 'dfcac176-0f67-46f5-afa7-cd0726980935',
              rowName: 'row134634',
              rowImage: null,
              tooltip: null,
            },
            {
              id: 'cfd061de-3376-4db3-9ed5-0570471ab708',
              rowName: 'row1436346',
              rowImage:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a117abe6-e123-4cd4-b347-ef449122bf26/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
          ],
          options: [
            {
              id: 'c83df725-30ab-451a-82f8-bfe2e45861d8',
              text: 'opt1',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/9be22419-980f-4486-83d8-6b728174dd93/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
            {
              id: 'df6b0ea0-b5d2-4047-bf74-a6d2f1b3653f',
              text: 'opt14',
              image: null,
              tooltip: null,
            },
            {
              id: '31c9a1e8-1ae9-410c-961d-bf6821b82a11',
              text: 'opt14',
              image:
                'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/299feb96-de86-412e-b907-adc8984c4f1e/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
              tooltip: null,
            },
          ],
          dataMatrix: null,
        },
        config: {
          removeBackButton: false,
          skippableItem: false,
          timer: 0,
          addScores: false,
          setAlerts: false,
          addTooltip: false,
          addTokens: null,
        },
        name: 'Item5233252353',
        isHidden: false,
        conditionalLogic: null,
        allowEdit: true,
        id: '9d14d126-cfe1-4ebb-8058-4d6f0902113a',
      },
    ],
    scoresAndReports: {
      generateReport: false,
      showScoreSummary: false,
      reports: [],
    },
  };

  const sampleAppletDetails = {
    id: 'a607c45a-4526-4317-be3c-b7eef337f11d',
    displayName: 'Notif 1',
    version: '5.0.0',
    description: '',
    about: '',
    image:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/68dff67f-47af-4ba9-adec-9440077b0e3d/IMAGE%202.png',
    watermark:
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/0e06365a-acc7-4db9-b7fc-8a0017a2354f/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
    theme: {
      id: '9b023afd-e5f9-403c-b154-fc8f35fcf3ab',
      name: 'Default',
      logo: 'https://media-dev.cmiml.net/mindlogger/content/some-logo.png',
      backgroundImage:
        'https://media-dev.cmiml.net/mindlogger/content/some-backgroundImage.png',
      primaryColor: '#0067a0',
      secondaryColor: '#fff',
      tertiaryColor: '#404040',
    },
    activities: [
      {
        id: '52ee0b2e-9e9a-4145-9b2f-2ca7ac5a66ad',
        name: 'Activity0000 (1)',
        description: 'ASASD',
        image:
          'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c22ba829-ad08-4a7c-bbe6-9fd5a719f7e3/IMAGE%202.png',
        isReviewable: false,
        isSkippable: false,
        showAllAtOnce: false,
        isHidden: false,
        responseIsEditable: true,
        order: 1,
        splashScreen:
          'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c26556ef-ef83-4782-9397-ea017a534e1c/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      },
    ],
    activityFlows: [],
    encryption: {
      publicKey: '[59]',
      prime: '[123,91]',
      base: '[2]',
      accountId: '2923f4a9-20ef-4995-a340-251d96ff3082',
    },
    streamEnabled: false,
    streamIpAddress: null,
    streamPort: null,
    integrations: [],
  };

  it('should collect image URLs from AppletRecord', () => {
    const result = collectAppletRecordImageUrls(sampleApplet);
    expect(result).toEqual([
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/0e06365a-acc7-4db9-b7fc-8a0017a2354f/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/68dff67f-47af-4ba9-adec-9440077b0e3d/IMAGE%202.png',
      'https://media-dev.cmiml.net/mindlogger/content/some-logo.png',
      'https://media-dev.cmiml.net/mindlogger/content/some-backgroundImage.png',
    ]);
  });

  it('should collect image URLs from AppletDetails', () => {
    const result = collectAppletDetailsImageUrls(sampleAppletDetails);
    expect(result).toEqual([
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/0e06365a-acc7-4db9-b7fc-8a0017a2354f/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/68dff67f-47af-4ba9-adec-9440077b0e3d/IMAGE%202.png',
      'https://media-dev.cmiml.net/mindlogger/content/some-logo.png',
      'https://media-dev.cmiml.net/mindlogger/content/some-backgroundImage.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c26556ef-ef83-4782-9397-ea017a534e1c/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c22ba829-ad08-4a7c-bbe6-9fd5a719f7e3/IMAGE%202.png',
    ]);
  });

  it('should collect image URLs from ActivityDetails', () => {
    // @ts-expect-error
    const result = collectActivityDetailsImageUrls(sampleActivity);
    expect(result).toEqual([
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c22ba829-ad08-4a7c-bbe6-9fd5a719f7e3/IMAGE%202.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/c26556ef-ef83-4782-9397-ea017a534e1c/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a0f92bce-f866-4fe8-941c-f45e6e742438/Screenshot%202023-11-29%20at%2016.20.51.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/2872f145-ecde-4c82-951f-4dc91c951f74/Screenshot%202023-12-21%20at%2013.15.05.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a22e156f-e878-4582-a6d0-2667935633ef/Screenshot%202023-11-29%20at%2016.20.51.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/655bf5dd-2a29-4e80-977d-1325811bd93d/Screenshot%202023-12-21%20at%2013.15.05.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/deac0b73-c095-4dbc-bdb6-21c54604cda4/Screenshot%202023-12-28%20at%2013.25.47.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/655bf5dd-2a29-4e80-977d-1325811bd93d/Screenshot%202023-12-21%20at%2013.15.05.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/add2820e-9a15-44d9-9b2e-55308d7416b3/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d46db44f-2753-4835-857f-417ceda9ee92/IMAGE%202.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/add2820e-9a15-44d9-9b2e-55308d7416b3/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/2c6899fb-8b40-4be7-be00-6ace066912d0/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d99adefb-7eb2-43eb-9256-a969a398aab9/%D0%A8%D0%AC%D0%A4%D0%9F%D0%A3%206.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/b437b176-c858-4ba5-8504-bca555ebf627/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/d8518307-e9a5-4fea-9450-33c685e74ec3/625dea55-f558-4352-b40f-5c88e5530cd0-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/168d9049-28eb-43a9-93a3-006e24d9d3c5/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/07aec1f7-430b-4aa0-a1bf-621790a68902/IMAGE%202.png',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/a117abe6-e123-4cd4-b347-ef449122bf26/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/9be22419-980f-4486-83d8-6b728174dd93/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
      'https://media-dev.cmiml.net/mindlogger/content/2923f4a9-20ef-4995-a340-251d96ff3082/299feb96-de86-412e-b907-adc8984c4f1e/7e0bfc92-cbc8-4f13-b204-1efbd507554c-2923f4a9-20ef-4995-a340-251d96ff3082-Item.jpg',
    ]);
  });
});

describe('collectMarkdownImageUrls function', () => {
  test('should extract URLs from Markdown image syntax', () => {
    const markdown = `![Alt text](https://example.com/image1.png)`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(['https://example.com/image1.png']);
  });

  test('should extract URLs from HTML <img> tags', () => {
    const markdown = `<img src="https://example.com/image2.jpg" alt="Example Image" />`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(['https://example.com/image2.jpg']);
  });

  test('should extract and cleans URLs with markdown-it-imsize syntax', () => {
    const markdown = `![1F600.png](https://example.com/image3.png =1000x1000)`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(['https://example.com/image3.png']);
  });

  test('should remove size specifiers with width only (markdown-it-imsize)', () => {
    const markdown = `![1F601.png](https://example.com/image4.png =500x)`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(['https://example.com/image4.png']);
  });

  test('should remove size specifiers with height only (markdown-it-imsize)', () => {
    const markdown = `![1F602.png](https://example.com/image5.png =x800)`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(['https://example.com/image5.png']);
  });

  test('should extract multiple URLs and removes duplicates', () => {
    const markdown = `
      ![Alt text](https://example.com/image1.png)
      <img src="https://example.com/image2.jpg" alt="Example Image" />
      ![Duplicate](https://example.com/image1.png)
      <img src="https://example.com/image2.jpg" alt="Another Example Image" />
      ![1F600.png](https://example.com/image3.png =1000x1000)
      ![1F600.png](https://example.com/image3.png =1000x1000)
    `;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual(
      expect.arrayContaining([
        'https://example.com/image1.png',
        'https://example.com/image2.jpg',
        'https://example.com/image3.png',
      ]),
    );
  });

  test('should handle markdown with no images gracefully', () => {
    const markdown = `This is a text without any images.`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual([]);
  });

  test('should handle invalid image syntax gracefully', () => {
    const markdown = `![Missing parenthesis](https://example.com/image4.jpg`;
    const result = collectMarkdownImageUrls(markdown);

    expect(result).toEqual([]);
  });
});
