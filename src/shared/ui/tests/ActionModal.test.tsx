import { fireEvent, render, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { palette } from '@app/shared/lib/constants/palette';

import { ActionModal } from '../ActionModal';

const handlers = () => ({
  onPrimary: jest.fn(),
  onSecondary: jest.fn(),
  onDismiss: jest.fn(),
});

const renderModal = (
  props: Partial<Parameters<typeof ActionModal>[0]> &
    ReturnType<typeof handlers>,
) =>
  render(
    <TamaguiProvider>
      <ActionModal
        visible
        title="Title"
        body="Body"
        primaryLabel="Primary"
        secondaryLabel="Secondary"
        {...props}
      />
    </TamaguiProvider>,
  );

describe('ActionModal', () => {
  afterEach(() => {
    screen.unmount();
  });

  it('renders title, body and both buttons', () => {
    renderModal(handlers());

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Body')).toBeDefined();
    expect(screen.getByTestId('action-modal-primary')).toBeDefined();
    expect(screen.getByTestId('action-modal-secondary')).toBeDefined();
  });

  it('calls the matching handler for each button', () => {
    const h = handlers();
    renderModal(h);

    fireEvent.press(screen.getByTestId('action-modal-primary'));
    fireEvent.press(screen.getByTestId('action-modal-secondary'));

    expect(h.onPrimary).toHaveBeenCalledTimes(1);
    expect(h.onSecondary).toHaveBeenCalledTimes(1);
    expect(h.onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss when the scrim is pressed', () => {
    const h = handlers();
    renderModal(h);

    fireEvent.press(screen.getByTestId('action-modal-scrim'));

    expect(h.onDismiss).toHaveBeenCalledTimes(1);
    expect(h.onPrimary).not.toHaveBeenCalled();
    expect(h.onSecondary).not.toHaveBeenCalled();
  });

  it('does not call onDismiss when the card is pressed', () => {
    const h = handlers();
    renderModal(h);

    fireEvent.press(screen.getByTestId('action-modal'));
    fireEvent.press(screen.getByText('Body'));

    expect(h.onDismiss).not.toHaveBeenCalled();
  });

  it('renders the secondary action as a text button', () => {
    renderModal(handlers());

    expect(screen.getByText('Secondary').props.style).toEqual(
      expect.objectContaining({
        color: palette.primary,
        fontFamily: 'Moderat-Regular',
      }),
    );
  });

  it('renders nothing when not visible', () => {
    renderModal({ ...handlers(), visible: false });

    expect(screen.queryByText('Title')).toBeNull();
    expect(screen.queryByTestId('action-modal-scrim')).toBeNull();
  });

  it('uses a custom testID prefix', () => {
    renderModal({ ...handlers(), testID: 'resume-restart' });

    expect(screen.getByTestId('resume-restart')).toBeDefined();
    expect(screen.getByTestId('resume-restart-primary')).toBeDefined();
    expect(screen.getByTestId('resume-restart-scrim')).toBeDefined();
  });
});
