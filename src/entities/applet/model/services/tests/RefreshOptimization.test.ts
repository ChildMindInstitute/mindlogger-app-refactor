import { QueryClient } from '@tanstack/react-query';

import { AppletDto } from '@app/shared/api/services/IAppletService';

import { RefreshOptimization } from '../RefreshOptimization';

type MockAppletsResponse = {
  result: Array<AppletDto>;
};

const queryClientMock = {} as QueryClient;

describe('Test RefreshOptimization', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('Should set keptVersions to empty array when applet cache returns null', () => {
    const optimization = new RefreshOptimization(queryClientMock);

    //@ts-expect-error
    optimization.getData = jest.fn().mockReturnValue(null);

    optimization.keepExistingAppletVersions();

    //@ts-ignore
    const result = optimization.keptVersions;

    expect(result).toEqual([]);
  });

  it('Should set keptVersions to empty array when applet cache returns undefined', () => {
    const optimization = new RefreshOptimization(queryClientMock);

    //@ts-expect-error
    optimization.getData = jest.fn().mockReturnValue(undefined);

    optimization.keepExistingAppletVersions();

    //@ts-ignore
    const result = optimization.keptVersions;

    expect(result).toEqual([]);
  });

  it('Should set keptVersions to array with two items when applet cache returns response with two applets', () => {
    const optimization = new RefreshOptimization(queryClientMock);

    const mockedValue: MockAppletsResponse = {
      result: [
        {
          id: 'mock-id-1',
          about: 'mock-about-id-1',
          version: 'mock-version-1',
        } as AppletDto,
        {
          id: 'mock-id-2',
          about: 'mock-about-id-2',
          version: 'mock-version-2',
        } as AppletDto,
      ],
    };

    //@ts-expect-error
    optimization.getData = jest.fn().mockReturnValue(mockedValue);

    optimization.keepExistingAppletVersions();

    //@ts-ignore
    const result = optimization.keptVersions;

    expect(result).toEqual([
      {
        appletId: 'mock-id-1',
        version: 'mock-version-1',
      },
      {
        appletId: 'mock-id-2',
        version: 'mock-version-2',
      },
    ]);
  });

  const tests = [
    {
      input: { id: 'mock-id-1', version: 'mock-version-1' },
      expected: false,
      test: 'Should return false when an item with existing version and id kept',
    },
    {
      input: { id: 'mock-id-2', version: 'mock-version-2' },
      expected: false,
      test: 'Should return false when another item with existing version and id kept',
    },
    {
      input: { id: 'mock-id-1', version: 'mock-version-3' },
      expected: true,
      test: 'Should return true when an applet with the input id kept, but no input version in the cache',
    },
    {
      input: { id: 'mock-id-3', version: 'mock-version-1' },
      expected: true,
      test: 'Should return true when no any applet with the input id kept',
    },
  ];

  tests.forEach(({ test, input, expected }) => {
    it(test, () => {
      const optimization = new RefreshOptimization(queryClientMock);

      const mockedValue: MockAppletsResponse = {
        result: [
          {
            id: 'mock-id-1',
            about: 'mock-about-id-1',
            version: 'mock-version-1',
          } as AppletDto,
          {
            id: 'mock-id-2',
            about: 'mock-about-id-2',
            version: 'mock-version-2',
          } as AppletDto,
        ],
      };

      //@ts-expect-error
      optimization.getData = jest.fn().mockReturnValue(mockedValue);

      optimization.keepExistingAppletVersions();

      const result = optimization.shouldBeFullyUpdated(input as AppletDto);

      expect(result).toEqual(expected);
    });
  });
});
