import { AppletAnalyticsDto } from './AppletAnalyticsDto';

export const appletAnalyticsMock: AppletAnalyticsDto = {
  appletId: '37409343987492836',
  activitiesResponses: [
    {
      id: '1',
      name: 'Activity',
      responses: [
        {
          type: 'singleSelect',
          name: 'Single selection',
          responseConfig: {
            options: [
              {
                name: '1',
                value: 1,
              },
              {
                name: '2',
                value: 2,
              },
            ],
          },
          data: [
            {
              date: '2023-07-05T14:55:16.920Z',
              value: 1,
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Activity 2',
      responses: [
        {
          type: 'multiSelect',
          name: 'Multi selection',
          responseConfig: {
            options: [
              {
                name: '1',
                value: 1,
              },
              {
                name: '2',
                value: 2,
              },
              {
                name: '3',
                value: 3,
              },
            ],
          },
          data: [
            {
              date: '2023-07-04T14:55:16.920Z',
              value: 1,
            },
            {
              date: '2023-07-04T14:55:16.920Z',
              value: 2,
            },
            {
              date: '2023-07-05T14:55:16.920Z',
              value: 3,
            },
          ],
        },
        {
          type: 'slider',
          name: 'Slider test',
          responseConfig: null,
          data: [
            { date: '2023-07-04T14:55:16.920Z', value: 2 },
            { date: '2023-07-05T14:55:16.920Z', value: 3 },
            { date: '2023-07-05T14:55:16.920Z', value: 1 },
          ],
        },
      ],
    },
  ],
};
