import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import {
  promptResumeRestart,
  ResumeRestartChoice,
  ResumeRestartPromptHost,
} from '../ResumeRestartPrompt';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderHost = () =>
  render(
    <TamaguiProvider>
      <ResumeRestartPromptHost />
    </TamaguiProvider>,
  );

const openPrompt = () => {
  let promise!: Promise<ResumeRestartChoice>;
  act(() => {
    promise = promptResumeRestart();
  });
  return promise;
};

const showPrompt = () => {
  openPrompt().catch(() => undefined);
};

const press = (testID: string) => fireEvent.press(screen.getByTestId(testID));

const PRIMARY = 'resume-restart-modal-primary';
const SECONDARY = 'resume-restart-modal-secondary';
const SCRIM = 'resume-restart-modal-scrim';

describe('ResumeRestartPrompt', () => {
  it('resolves "resume" from the chooser and closes', async () => {
    renderHost();
    const result = openPrompt();

    expect(
      screen.getByText('additional:activity_in_progress_title'),
    ).toBeDefined();

    press(PRIMARY);

    await expect(result).resolves.toBe('resume');
    expect(screen.queryByTestId('resume-restart-modal')).toBeNull();
  });

  it('resolves "restart" only after confirming', async () => {
    renderHost();
    const result = openPrompt();

    press(SECONDARY);

    expect(screen.getByText('additional:restart_activity_title')).toBeDefined();

    press(PRIMARY);

    await expect(result).resolves.toBe('restart');
  });

  it('returns to the chooser on Back', () => {
    renderHost();
    showPrompt();

    press(SECONDARY);
    press(SECONDARY);

    expect(
      screen.getByText('additional:activity_in_progress_title'),
    ).toBeDefined();
  });

  it('resolves "dismiss" on scrim tap', async () => {
    renderHost();
    const result = openPrompt();

    press(SCRIM);

    await expect(result).resolves.toBe('dismiss');
    expect(screen.queryByTestId('resume-restart-modal')).toBeNull();
  });

  it('dismisses an open prompt when a new one is requested', async () => {
    renderHost();
    const first = openPrompt();
    const second = openPrompt();

    await expect(first).resolves.toBe('dismiss');

    press(PRIMARY);

    await expect(second).resolves.toBe('resume');
  });
});
