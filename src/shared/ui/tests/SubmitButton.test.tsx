import { fireEvent, render, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { palette } from '@app/shared/lib/constants/palette';

import { SubmitButton } from '../SubmitButton';

const renderButton = (props: Partial<Parameters<typeof SubmitButton>[0]>) =>
  render(
    <TamaguiProvider>
      <SubmitButton {...props}>Label</SubmitButton>
    </TamaguiProvider>,
  );

describe('SubmitButton', () => {
  afterEach(() => {
    screen.unmount();
  });

  it.each([
    ['primary', palette.on_primary],
    ['tonal', palette.on_secondary_container],
    ['text', palette.primary],
    ['destructive', palette.on_primary],
  ] as const)('renders %s mode label color', (mode, color) => {
    renderButton({ mode });

    expect(screen.getByText('Label').props.style).toEqual(
      expect.objectContaining({ color }),
    );
  });

  it('calls onPress when enabled', () => {
    const onPress = jest.fn();
    renderButton({ mode: 'destructive', onPress });

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    renderButton({ mode: 'text', onPress, disabled: true });

    fireEvent.press(screen.getByTestId('submit-button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('uses a custom testID when provided', () => {
    renderButton({ testID: 'custom-button' });

    expect(screen.getByTestId('custom-button')).toBeDefined();
    expect(screen.queryByTestId('submit-button')).toBeNull();
  });
});
