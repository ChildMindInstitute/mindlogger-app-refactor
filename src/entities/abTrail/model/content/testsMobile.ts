import { DeviceTests, TestScreenPayload } from '../../lib';

const mobileTestFirst: TestScreenPayload = {
  config: {
    radius: 4.18,
    fontSize: 5.6,
  },
  nodes: [
    {
      orderIndex: 1,
      cx: 52.24,
      cy: 11.94,
      label: '1',
    },
    {
      orderIndex: 2,
      cx: 85.07,
      cy: 17.91,
      label: '2',
    },
    {
      orderIndex: 3,
      cx: 88.06,
      cy: 74.63,
      label: '3',
    },
    {
      orderIndex: 4,
      cx: 53.73,
      cy: 86.57,
      label: '4',
    },
    {
      orderIndex: 5,
      cx: 77.61,
      cy: 40.3,
      label: '5',
    },
    {
      orderIndex: 6,
      cx: 17.01,
      cy: 38.81,
      label: '6',
    },
    {
      orderIndex: 7,
      cx: 53.73,
      cy: 56.72,
      label: '7',
    },
    {
      orderIndex: 8,
      cx: 19.4,
      cy: 79.1,
      label: '8',
    },
    {
      orderIndex: 9,
      cx: 14.93,
      cy: 59.7,
      label: '9',
    },
    {
      orderIndex: 10,
      cx: 50.75,
      cy: 31.34,
      label: '10',
    },
    {
      orderIndex: 11,
      cx: 13.43,
      cy: 14.93,
      label: '11',
    },
  ],
};

const mobileTestSecond: TestScreenPayload = {
  config: {
    radius: 4.18,
    fontSize: 5.97,
  },
  nodes: [
    {
      orderIndex: 1,
      cx: 17.01,
      cy: 38.81,
      label: '1',
    },
    {
      orderIndex: 2,
      cx: 77.61,
      cy: 40.3,
      label: '2',
    },
    {
      orderIndex: 3,
      cx: 52.24,
      cy: 11.94,
      label: '3',
    },
    {
      orderIndex: 4,
      cx: 13.43,
      cy: 14.93,
      label: '4',
    },
    {
      orderIndex: 5,
      cx: 53.73,
      cy: 56.72,
      label: '5',
    },
    {
      orderIndex: 6,
      cx: 85.07,
      cy: 17.91,
      label: '6',
    },
    {
      orderIndex: 7,
      cx: 88.06,
      cy: 74.63,
      label: '7',
    },
    {
      orderIndex: 8,
      cx: 14.93,
      cy: 59.7,
      label: '8',
    },
    {
      orderIndex: 9,
      cx: 19.4,
      cy: 79.1,
      label: '9',
    },
    {
      orderIndex: 10,
      cx: 50.75,
      cy: 31.34,
      label: '10',
    },
    {
      orderIndex: 11,
      cx: 53.73,
      cy: 86.57,
      label: '11',
    },
  ],
};

const mobileTestThird: TestScreenPayload = {
  config: {
    radius: 4.18,
    fontSize: 5.97,
  },
  nodes: [
    {
      orderIndex: 1,
      cx: 53.73,
      cy: 86.57,
      label: '1',
    },
    {
      orderIndex: 2,
      cx: 88.06,
      cy: 74.63,
      label: 'A',
    },
    {
      orderIndex: 3,
      cx: 85.07,
      cy: 17.91,
      label: '2',
    },
    {
      orderIndex: 4,
      cx: 52.24,
      cy: 11.94,
      label: 'B',
    },
    {
      orderIndex: 5,
      cx: 77.61,
      cy: 40.3,
      label: '3',
    },
    {
      orderIndex: 6,
      cx: 14.92,
      cy: 59.7,
      label: 'C',
    },
    {
      orderIndex: 7,
      cx: 50.75,
      cy: 31.34,
      label: '4',
    },
    {
      orderIndex: 8,
      cx: 13.43,
      cy: 14.92,
      label: 'D',
    },
    {
      orderIndex: 9,
      cx: 53.73,
      cy: 56.72,
      label: '5',
    },
    {
      orderIndex: 10,
      cx: 17.01,
      cy: 38.81,
      label: 'E',
    },
    {
      orderIndex: 11,
      cx: 19.4,
      cy: 79.1,
      label: '6',
    },
  ],
};

const mobileTestFourth: TestScreenPayload = {
  config: {
    radius: 4.18,
    fontSize: 5.97,
  },
  nodes: [
    {
      orderIndex: 1,
      cx: 50.75,
      cy: 31.34,
      label: '1',
    },
    {
      orderIndex: 2,
      cx: 13.43,
      cy: 14.93,
      label: 'A',
    },
    {
      orderIndex: 3,
      cx: 52.24,
      cy: 11.94,
      label: '2',
    },
    {
      orderIndex: 4,
      cx: 17.01,
      cy: 38.81,
      label: 'B',
    },
    {
      orderIndex: 5,
      cx: 77.61,
      cy: 40.3,
      label: '3',
    },
    {
      orderIndex: 6,
      cx: 85.07,
      cy: 17.91,
      label: 'C',
    },
    {
      orderIndex: 7,
      cx: 88.06,
      cy: 74.63,
      label: '4',
    },
    {
      orderIndex: 8,
      cx: 14.93,
      cy: 59.7,
      label: 'D',
    },
    {
      orderIndex: 9,
      cx: 53.73,
      cy: 56.72,
      label: '5',
    },
    {
      orderIndex: 10,
      cx: 19.4,
      cy: 79.1,
      label: 'E',
    },
    {
      orderIndex: 11,
      cx: 53.73,
      cy: 86.57,
      label: '6',
    },
  ],
};

export const MobileTests: DeviceTests = {
  0: mobileTestFirst,
  1: mobileTestSecond,
  2: mobileTestThird,
  3: mobileTestFourth,
};
