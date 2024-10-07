import { ActivityItemDto } from '@app/shared/api/services/ActivityItemDto';
import { ActivityDto } from '@app/shared/api/services/IActivityService';
import { AnalyticsAnswerDto } from '@app/shared/api/services/IAppletAnalyticsService';
import {
  AppletDetailsResponse,
  ThemeDto,
  AppletDto,
  ActivityRecordDto,
  ActivityFlowRecordDto,
  AppletDetailsDto,
} from '@app/shared/api/services/IAppletService';
import { CompletedEntityDto } from '@app/shared/api/services/IEventsService';

export const appletDetailsResponse: AppletDetailsResponse = {
  // @ts-ignore
  result: undefined,
  respondentMeta: {
    nickname: 'Some nick',
  },
};

export const completedEntityDto: CompletedEntityDto = {
  id: '0',
  answerId: '1',
  submitId: '2',
  scheduledEventId: '3',
  targetSubjectId: '4',
  localEndDate: '2020-04-04',
  localEndTime: '20:00',
};

// @ts-expect-error
export const themeDtoWithEmptyImages: ThemeDto = {
  id: '1',
  name: 'theme',
  primaryColor: '#f00',
  secondaryColor: '#0f0',
  tertiaryColor: '#00f',
};

export const themeDto: ThemeDto = {
  ...themeDtoWithEmptyImages,
  logo: 'https://logoimage',
  backgroundImage: 'https://backgroundImage',
};

export const firstAppletDto: AppletDto = {
  id: '1',
  image: 'https://appletImage',
  displayName: 'displayName',
  description: 'description',
  theme: themeDto,
  version: '1.1.11',
  about: 'About text',
  watermark: 'https://watermark',
};

export const secondAppletDto: AppletDto = {
  id: '2',
  image: 'https://appletImagesecond',
  displayName: 'displayName second',
  description: 'description second',
  theme: themeDtoWithEmptyImages,
  version: '2.2.2222',
  about: 'About text second applet',
  watermark: 'https://watermarksecond',
};

export const activityRecordsDto: ActivityRecordDto[] = [
  {
    id: '1',
    name: 'name',
    description: 'description',
    image: null,
    isReviewable: false,
    isSkippable: false,
    showAllAtOnce: false,
    isHidden: false,
    autoAssign: false,
    responseIsEditable: false,
    order: 2,
    splashScreen: 'https://splash',
  },
  {
    id: '2',
    name: 'name',
    description: 'description',
    image: null,
    isReviewable: false,
    isSkippable: false,
    showAllAtOnce: false,
    isHidden: false,
    autoAssign: false,
    responseIsEditable: false,
    order: 1,
    splashScreen: 'https://splash',
  },
];

const activityFlows: ActivityFlowRecordDto[] = [
  {
    id: '100',
    name: 'name',
    description: 'description',
    hideBadge: false,
    isSingleReport: false,
    order: 0,
    isHidden: false,
    autoAssign: false,
    activityIds: ['1', '2'],
  },
];
export const appletDetailsDto: AppletDetailsDto = {
  ...firstAppletDto,
  encryption: {
    accountId: 'accountId',
    base: 'Base10',
    prime: 'Prime10',
    publicKey: 'pub10',
  },
  streamEnabled: true,
  streamIpAddress: '127.0.0.1',
  streamPort: null,
  activities: activityRecordsDto,
  activityFlows: activityFlows,
  integrations: ['loris'],
};

const activityItems: ActivityItemDto[] = [
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
    id: '1',
    timer: null,
    order: 1,
  },

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
    id: '2',
    order: 1,
  },
  {
    question: 'question',
    responseType: 'singleSelect',
    order: 1,
    timer: null,
    responseValues: {
      options: [
        {
          id: '1',
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
    name: 'name',
    isHidden: false,
    conditionalLogic: null,
    id: '3',
  },
];

const activitiesDto: ActivityDto[] = [
  {
    id: '1',
    name: 'one',
    description: 'description one',
    splashScreen: null,
    image: null,
    showAllAtOnce: false,
    isSkippable: true,
    isReviewable: false,
    isHidden: false,
    autoAssign: false,
    responseIsEditable: true,
    order: 0,
    items: activityItems,
  },
  {
    id: '2',
    name: 'two',
    splashScreen: null,
    // @ts-expect-error
    description: null,
    image: null,
    showAllAtOnce: false,
    isSkippable: true,
    isReviewable: false,
    isHidden: false,
    responseIsEditable: true,
    order: 0,
    items: activityItems,
  },
];

export const createdAtDate = '2020-04-04T20:00:00.000Z';

export const answersDto: AnalyticsAnswerDto[] = [
  {
    answer: 'Some answer 1 ',
    createdAt: createdAtDate,
    itemIds: ['1', '2', '3'],
    activityId: '1',
  },
  {
    answer: 'Some answer 2',
    createdAt: createdAtDate,
    itemIds: ['1', '2', '3'],
    activityId: '2',
  },
  {
    answer: 'Some answer 3',
    createdAt: createdAtDate,
    itemIds: ['3'],
    activityId: '3',
  },
];

const encryptionMockService = {
  decrypt: () =>
    JSON.stringify([
      {
        value: [1],
      },
      {
        value: [2],
      },
      {
        value: '1',
      },
    ]),
};

const encryptionMockServiceWithEmptyAnswers = {
  decrypt: () => '{}',
};

export const analyticsMapperInput = {
  appletId: '1',
  activitiesDto: activitiesDto,
  answersDto: answersDto,
  encryptionService: encryptionMockService,
};

export const analyticsMapperInputWithEmptyAnswers = {
  appletId: '1',
  activitiesDto: activitiesDto,
  answersDto: answersDto,
  encryptionService: encryptionMockServiceWithEmptyAnswers,
};

export const analyticsMapperInputWithEmptyActivities = {
  appletId: '1',
  answersDto: answersDto,
  encryptionService: encryptionMockServiceWithEmptyAnswers,
};
