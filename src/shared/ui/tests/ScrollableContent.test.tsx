import React, { PropsWithChildren } from 'react';
import { Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';

import { ScrollableContent } from '../ScrollableContent';

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const { ScrollView } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    KeyboardAwareScrollView: ({
      children,
      onContentSizeChange,
    }: PropsWithChildren<{
      onContentSizeChange: (width: number, height: number) => void;
    }>) => (
      <ScrollView
        testID="scroll-view"
        onContentSizeChange={onContentSizeChange}
      >
        {children}
      </ScrollView>
    ),
  };
});

jest.mock('../ScrollButton', () => {
  const { View } =
    jest.requireActual<typeof import('react-native')>('react-native');

  return {
    ScrollButton: () => <View testID="scroll-button" />,
  };
});

const ContainerHeight = 600;

const DebounceDelay = 300;

const renderComponent = () =>
  render(
    <TamaguiProvider>
      <ScrollableContent>
        <Text>Content</Text>
      </ScrollableContent>
    </TamaguiProvider>,
  );

const layoutContainer = () => {
  fireEvent(screen.getByTestId('scroll-view'), 'layout', {
    nativeEvent: { layout: { height: ContainerHeight } },
  });
};

const changeContentHeight = (height: number) => {
  fireEvent(screen.getByTestId('scroll-view'), 'contentSizeChange', 0, height);

  act(() => {
    jest.advanceTimersByTime(DebounceDelay);
  });
};

const isScrollButtonVisible = () => {
  let node = screen.getByTestId('scroll-button').parent;

  while (node && node.props.pointerEvents === undefined) {
    node = node.parent;
  }

  return node?.props.pointerEvents === 'auto';
};

describe('ScrollableContent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should show the scroll button when content overflows on initial layout', () => {
    renderComponent();

    layoutContainer();
    changeContentHeight(ContainerHeight * 2);

    expect(isScrollButtonVisible()).toBe(true);
  });

  it('Should not show the scroll button when content fits on initial layout', () => {
    renderComponent();

    layoutContainer();
    changeContentHeight(ContainerHeight / 2);

    expect(isScrollButtonVisible()).toBe(false);
  });

  it('Should not show the scroll button when content grows to overflow after initial layout', () => {
    renderComponent();

    layoutContainer();
    changeContentHeight(ContainerHeight / 2);

    // e.g. a long text answer being typed
    changeContentHeight(ContainerHeight * 2);

    expect(isScrollButtonVisible()).toBe(false);
  });
});
