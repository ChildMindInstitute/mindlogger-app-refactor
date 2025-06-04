import React from 'react';
import { View } from 'react-native';

import { useAppState } from '@react-native-community/hooks';
import { fireEvent, render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { Banner } from './Banner';

// Mock dependencies
jest.mock('@react-native-community/hooks', () => ({
  useAppState: jest.fn(),
}));

// Mock timer
jest.useFakeTimers();

describe('Banner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAppState as jest.Mock).mockReturnValue('active');
  });

  test('renders correctly with default props', () => {
    const { getByText, getByLabelText } = render(
      <TamaguiProvider>
        <Banner>Test banner message</Banner>
      </TamaguiProvider>,
    );

    // Check content is displayed
    expect(getByText('Test banner message')).toBeTruthy();

    // Check default severity (success)
    expect(getByLabelText('success-banner')).toBeTruthy();

    // No close button by default since onClose is not provided
    expect(() => getByLabelText('banner-close')).toThrow();
  });

  test('renders with custom severity', () => {
    const { getByLabelText } = render(
      <TamaguiProvider>
        <Banner severity="error">Error message</Banner>
      </TamaguiProvider>,
    );

    // Check severity is applied
    expect(getByLabelText('error-banner')).toBeTruthy();
  });

  test('renders close button when onClose is provided', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <TamaguiProvider>
        <Banner onClose={onClose}>Test message</Banner>
      </TamaguiProvider>,
    );

    // Close button should be visible
    expect(getByLabelText('banner-close')).toBeTruthy();
  });

  test('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <TamaguiProvider>
        <Banner onClose={onClose}>Test message</Banner>
      </TamaguiProvider>,
    );

    // Press close button
    fireEvent.press(getByLabelText('banner-close'));

    // Check onClose was called with 'manual' reason
    expect(onClose).toHaveBeenCalledWith('manual');
  });

  test('auto-closes after duration when app is active', async () => {
    const onClose = jest.fn();
    render(
      <TamaguiProvider>
        <Banner onClose={onClose} duration={2000}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    // Check onClose was called with 'timeout' reason
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  test('does not auto-close when duration is null', () => {
    const onClose = jest.fn();
    render(
      <TamaguiProvider>
        <Banner onClose={onClose} duration={null}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Fast-forward time
    jest.advanceTimersByTime(10000);

    // onClose should not be called
    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not auto-close when app is not active', () => {
    (useAppState as jest.Mock).mockReturnValue('background');

    const onClose = jest.fn();
    render(
      <TamaguiProvider>
        <Banner onClose={onClose} duration={2000}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    // onClose should not be called when app is in background
    expect(onClose).not.toHaveBeenCalled();
  });

  test('does not auto-close when banner is being pressed', () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <TamaguiProvider>
        <Banner onClose={onClose} duration={2000}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Simulate pressing the banner
    fireEvent(getByLabelText('success-banner'), 'pressIn');

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    // onClose should not be called while pressing
    expect(onClose).not.toHaveBeenCalled();

    // Release press
    fireEvent(getByLabelText('success-banner'), 'pressOut');

    // Timer should restart after release
    jest.advanceTimersByTime(2000);

    // Now onClose should be called
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  test('applies custom icon', () => {
    const customIcon = <View accessibilityLabel="custom-icon" />;
    const { getByLabelText } = render(
      <TamaguiProvider>
        <Banner icon={customIcon}>Test message</Banner>
      </TamaguiProvider>,
    );

    expect(getByLabelText('custom-icon')).toBeTruthy();
  });

  test('cleans up timeout on unmount', () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <TamaguiProvider>
        <Banner onClose={onClose} duration={2000}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Unmount component
    unmount();

    // Fast-forward time
    jest.advanceTimersByTime(2000);

    // onClose should not be called after unmount
    expect(onClose).not.toHaveBeenCalled();
  });

  test('can hide close button with hasCloseButton=false', () => {
    const onClose = jest.fn();
    const { queryByLabelText } = render(
      <TamaguiProvider>
        <Banner onClose={onClose} hasCloseButton={false}>
          Test message
        </Banner>
      </TamaguiProvider>,
    );

    // Close button should not be visible
    expect(queryByLabelText('banner-close')).toBeNull();
  });
});
