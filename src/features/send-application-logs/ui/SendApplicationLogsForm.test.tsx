import { render, fireEvent, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { wait } from '@app/shared/lib/utils/common';

import { SendApplicationLogsForm } from './SendApplicationLogsForm';

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
      <TamaguiProvider>
        <SendApplicationLogsForm />
      </TamaguiProvider>,
    );

    expect(screen.getByText('application_logs_screen:title')).toBeDefined();
    expect(screen.getByText('application_logs_screen:subTitle')).toBeDefined();
    expect(screen.getByTestId('submit-button')).toBeDefined();
  });

  it('Should render loading state', () => {
    render(
      <TamaguiProvider>
        <SendApplicationLogsForm />
      </TamaguiProvider>,
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(screen.getAllByTestId('loader').length).toEqual(2);
  });

  it('Should render success state', async () => {
    render(
      <TamaguiProvider>
        <SendApplicationLogsForm />
      </TamaguiProvider>,
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(screen.queryAllByTestId('loader').length).toEqual(2);

    expect(
      screen.queryAllByText('application_logs_screen:success').length,
    ).toEqual(0);

    expect(
      await screen.findByText('application_logs_screen:success'),
    ).toBeDefined();
  });
});
