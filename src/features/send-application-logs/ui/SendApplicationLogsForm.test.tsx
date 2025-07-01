import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { bannerReducer } from '@app/entities/banner/model/slice';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { wait } from '@app/shared/lib/utils/common';

import { SendApplicationLogsForm } from './SendApplicationLogsForm';

// Create a test store
const createTestStore = () =>
  configureStore({
    reducer: {
      banners: bannerReducer,
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return (
    <Provider store={store}>
      <TamaguiProvider>{children}</TamaguiProvider>
    </Provider>
  );
};

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation((key: string) => key),
  })),
}));

describe('Test SendApplicationLogsForm (basic positive tests)', () => {
  let logger: ILogger;

  beforeEach(() => {
    logger = getDefaultLogger();

    jest.spyOn(logger, 'send').mockImplementation(async () => {
      await wait(100);
      return true;
    });

    jest.spyOn(logger, 'log').mockReturnValue(undefined);
    jest.spyOn(logger, 'info').mockReturnValue(undefined);
    jest.spyOn(logger, 'warn').mockReturnValue(undefined);
    jest.spyOn(logger, 'error').mockReturnValue(undefined);
  });

  afterEach(() => {
    screen.unmount();
  });

  it('Should render initial state', () => {
    render(
      <TestWrapper>
        <SendApplicationLogsForm />
      </TestWrapper>,
    );

    expect(screen.getByText('application_logs_screen:title')).toBeDefined();
    expect(screen.getByText('application_logs_screen:subTitle')).toBeDefined();
    expect(screen.getByTestId('submit-button')).toBeDefined();
  });

  it('Should render loading state', () => {
    render(
      <TestWrapper>
        <SendApplicationLogsForm />
      </TestWrapper>,
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(screen.getAllByTestId('loader').length).toEqual(1);
  });

  it('Should render success state', async () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <TamaguiProvider>
          <SendApplicationLogsForm />
        </TamaguiProvider>
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(screen.queryAllByTestId('loader').length).toEqual(1);

    expect(
      screen.queryAllByText('application_logs_screen:success').length,
    ).toEqual(0);

    // Wait for the async operation to complete
    await wait(150);

    // Check that the success banner was added to the Redux state
    const state = store.getState();
    const banners = state.banners.banners;
    const successBanner = banners.find(
      banner =>
        banner.bannerProps.children === 'application_logs_screen:success',
    );

    expect(successBanner).toBeDefined();
    expect(successBanner?.bannerProps.severity).toBe('success');
  });
});
