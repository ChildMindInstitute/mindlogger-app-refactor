import { QueryClient } from '@tanstack/react-query';
import RefreshService from './RefreshService';
import mock from './mockData';

const MOCK_ACTIVITY_KEY = ['activities', { activityId: 'activity_test_id' }];
const MOCK_APPLET_KEY = ['applets', { appletId: 'applet_test_id' }];
const MOCK_APPLETS_KEY = ['applets'];
const MOCK_EVENTS_KEY = ['events', { appletId: 'applet_test_id' }];

jest.mock('@app/shared/api', () => ({
  ActivityService: {
    getById: jest.fn(() => mock.activityData),
  },
  AppletsService: {
    getAppletDetails: jest.fn(() => mock.appletDetails),
    getApplets: jest.fn(() => mock.applets),
  },
  EventsService: {
    getEvents: jest.fn(() => mock.eventResponse),
  },
}));

jest.mock('@app/shared/lib', () => ({
  getActivityDetailsKey: jest.fn(() => MOCK_ACTIVITY_KEY),
  collectActivityDetailsImageUrls: jest.fn(() => []),
  collectAppletDetailsImageUrls: jest.fn(() => []),
  getAppletDetailsKey: jest.fn(() => MOCK_APPLET_KEY),
  getEventsKey: jest.fn(() => MOCK_EVENTS_KEY),
  getAppletsKey: jest.fn(() => MOCK_APPLETS_KEY),
  isAppOnline: jest.fn(() => Promise.resolve(false)),
  onNetworkUnavailable: jest.fn(),
}));

const client = new QueryClient();

const getFakeRefreshAppletResults = () => [
  {
    appletId: 'test_id',
    activityId: 'e3442ee5-a83f-4b46-8473-37b4f9fda0ec',
  },
];

describe('RefreshService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isUrlValid function', () => {
    it('should confirm that url is valid', () => {
      const validUrl = 'https://google.com';

      const service = new RefreshService(client);

      const result = service.isUrlValid(validUrl);

      expect(result).toBe(true);
    });

    it('should confirm that url is not valid', () => {
      const wrongUrl = 'hello.world';

      const service = new RefreshService(client);

      const result = service.isUrlValid(wrongUrl);

      expect(result).toBe(false);
    });
  });

  describe('refreshActivityDetails function ', () => {
    it('should refresh activity details correctly', async () => {
      const service = new RefreshService(client);
      const mockCacheImages = jest.fn();

      service.cacheImages = mockCacheImages;

      await service.refreshActivityDetails('activity_test_id');

      expect(service.cacheImages).toBeCalledTimes(1);
      expect(service.cacheImages).toBeCalledWith([]);
    });
  });

  describe('refreshAppletDetails function', () => {
    it('should refresh applet correctly', async () => {
      const service = new RefreshService(client);
      const mockCacheImages = jest.fn();

      service.cacheImages = mockCacheImages;

      const fakeResult = getFakeRefreshAppletResults();

      const result = await service.refreshAppletDetails({
        id: 'test_id',
      });

      expect(service.cacheImages).toBeCalledTimes(1);
      expect(result.length).toBe(fakeResult.length);
      expect(result[0].appletId).toBe('test_id');
    });
  });

  describe('refreshAllApplets function', () => {
    it('should refresh all applets correctly', async () => {
      const service = new RefreshService(client);
      const mockResetAllQueries = jest.fn();
      const mockInvalidateCompletedEntities = jest.fn();
      const mockRefreshApplet = jest.fn();

      service.refreshApplet = mockRefreshApplet;
      service.resetAllQueries = mockResetAllQueries;
      service.invalidateCompletedEntities = mockInvalidateCompletedEntities;

      await service.refreshAllApplets();

      expect(service.refreshApplet).toBeCalledTimes(1);
      expect(service.invalidateCompletedEntities).toBeCalled();
    });
  });

  describe('refresh function', () => {
    it('should handle offline', async () => {
      const service = new RefreshService(client);
      const mockRefreshAllApplets = jest.fn();

      service.refreshAllApplets = mockRefreshAllApplets;

      await service.refresh();

      expect(service.refreshAllApplets).toBeCalledTimes(0);
    });
  });
});
