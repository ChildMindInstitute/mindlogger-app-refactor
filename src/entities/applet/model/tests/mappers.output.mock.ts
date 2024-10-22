import { createdAtDate } from './mappers.input.mock';
import { Activity, Applet, AppletDetails, AppletTheme } from '../../lib/types';

export const mappedApplets: Applet[] = [
  {
    description: 'description',
    displayName: 'displayName',
    id: '1',
    image: 'https://appletImage',
    numberOverdue: 0,
    theme: {
      backgroundImage: 'https://backgroundImage',
      // @ts-expect-error
      id: '1',
      logo: 'https://logoimage',
      name: 'theme',
      primaryColor: '#f00',
      secondaryColor: '#0f0',
      tertiaryColor: '#00f',
    },
  },
  {
    description: 'description second',
    displayName: 'displayName second',
    id: '2',
    image: 'https://appletImagesecond',
    numberOverdue: 0,
    theme: {
      // @ts-expect-error
      id: '1',
      name: 'theme',
      primaryColor: '#f00',
      secondaryColor: '#0f0',
      tertiaryColor: '#00f',
    },
  },
];

export const appletDetails: AppletDetails = {
  about: 'About text',
  activities: [
    {
      description: 'description',
      id: '1',
      image: null,
      name: 'name',
    },
    {
      description: 'description',
      id: '2',
      image: null,
      name: 'name',
    },
  ],
  activityFlows: [
    {
      activityIds: ['1', '2'],
      description: 'description',
      id: '100',
      image: null,
      name: 'name',
    },
  ],
  description: 'description',
  displayName: 'displayName',
  encryption: {
    accountId: 'accountId',
    base: 'Base10',
    prime: 'Prime10',
    publicKey: 'pub10',
  },
  id: '1',
  image: 'https://appletImage',
  streamEnabled: true,
  streamIpAddress: '127.0.0.1',
  streamPort: null,
  theme: {
    backgroundImage: 'https://backgroundImage',
    logo: 'https://logoimage',
    primaryColor: '#f00',
    secondaryColor: '#0f0',
    tertiaryColor: '#00f',
  },
  version: '1.1.11',
  watermark: 'https://watermark',
  consentsCapabilityEnabled: true,
};

export const appletTheme: AppletTheme = {
  backgroundImage: 'https://backgroundImage',
  logo: 'https://logoimage',
  primaryColor: '#f00',
  secondaryColor: '#0f0',
  tertiaryColor: '#00f',
};
export const appletThemeWithEmptyImages: AppletTheme = {
  // @ts-expect-error
  backgroundImage: undefined,
  // @ts-expect-error
  logo: undefined,
  primaryColor: '#f00',
  secondaryColor: '#0f0',
  tertiaryColor: '#00f',
};

export const mappedActivities: Activity[] = [
  {
    description: 'description',
    id: '1',
    image: null,
    name: 'name',
  },
  {
    description: 'description',
    id: '2',
    image: null,
    name: 'name',
  },
];

export const mappedAnalytics = {
  activitiesResponses: [
    {
      description: 'description one',
      id: '1',
      name: 'one',
      responses: [
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: 1,
            },
          ],
          name: 'Screen2',
          responseConfig: {
            options: [
              {
                name: 'string',
                value: 1,
              },
            ],
          },
          type: 'multiSelect',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: [2],
            },
          ],
          name: 'Screen2',
          responseConfig: {
            maxValue: 10,
            minValue: 0,
          },
          type: 'slider',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: '1',
            },
          ],
          name: 'name',
          responseConfig: {
            options: [
              {
                name: 'test',
                value: 0,
              },
            ],
          },
          type: 'singleSelect',
        },
      ],
    },
    {
      description: null,
      id: '2',
      name: 'two',
      responses: [
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: 1,
            },
          ],
          name: 'Screen2',
          responseConfig: {
            options: [
              {
                name: 'string',
                value: 1,
              },
            ],
          },
          type: 'multiSelect',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: [2],
            },
          ],
          name: 'Screen2',
          responseConfig: {
            maxValue: 10,
            minValue: 0,
          },
          type: 'slider',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: '1',
            },
          ],
          name: 'name',
          responseConfig: {
            options: [
              {
                name: 'test',
                value: 0,
              },
            ],
          },
          type: 'singleSelect',
        },
      ],
    },
  ],
  id: '1',
};

export const mappedAnalyticsWithEmptyAnswers = {
  activitiesResponses: [
    {
      description: 'description one',
      id: '1',
      name: 'one',
      responses: [
        {
          data: [],
          name: 'Screen2',
          responseConfig: {
            options: [
              {
                name: 'string',
                value: 1,
              },
            ],
          },
          type: 'multiSelect',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: null,
            },
          ],
          name: 'Screen2',
          responseConfig: {
            maxValue: 10,
            minValue: 0,
          },
          type: 'slider',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: null,
            },
          ],
          name: 'name',
          responseConfig: {
            options: [
              {
                name: 'test',
                value: 0,
              },
            ],
          },
          type: 'singleSelect',
        },
      ],
    },
    {
      description: null,
      id: '2',
      name: 'two',
      responses: [
        {
          data: [],
          name: 'Screen2',
          responseConfig: {
            options: [
              {
                name: 'string',
                value: 1,
              },
            ],
          },
          type: 'multiSelect',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: null,
            },
          ],
          name: 'Screen2',
          responseConfig: {
            maxValue: 10,
            minValue: 0,
          },
          type: 'slider',
        },
        {
          data: [
            {
              date: new Date(createdAtDate),
              value: null,
            },
          ],
          name: 'name',
          responseConfig: {
            options: [
              {
                name: 'test',
                value: 0,
              },
            ],
          },
          type: 'singleSelect',
        },
      ],
    },
  ],
  id: '1',
};
