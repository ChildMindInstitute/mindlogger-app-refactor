import React, { ComponentProps } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import {
  HandlersContext,
  ValuesContext,
} from '@app/shared/ui/Stepper/contexts';

import { ActivityItem } from '../ActivityItem';

jest.mock('@app/entities/activity/lib/hooks/useActivityAssignment', () => ({
  useActivityAssignment: () => ({ assignment: null }),
}));

jest.mock('@app/entities/applet/lib/hooks/useAppletStreamingDetails', () => ({
  useAppletStreamingDetails: () => null,
}));

jest.mock('@app/shared/lib/tcp/useSendLiveEvent', () => ({
  useSendEvent: () => ({ sendLiveEvent: jest.fn() }),
}));

jest.mock('@entities/unity/ui/UnityView', () => ({
  UnityView: () => null,
}));

jest.mock('@app/shared/ui/survey/ItemMarkdown', () => ({
  ItemMarkdown: () => null,
}));

jest.mock('@app/shared/ui/ScrollableContent', () => ({
  ScrollableContent: ({ children }: { children: React.ReactNode }) => children,
}));

// Each press selects the next option, like a user mashing different options
jest.mock('@app/shared/ui/survey/RadioActivityItem/RadioActivityItem', () => {
  const { Pressable } =
    jest.requireActual<typeof import('react-native')>('react-native');
  let pressCount = 0;

  return {
    RadioActivityItem: ({
      onChange,
    }: {
      onChange: (value: { id: string }) => void;
    }) => (
      <Pressable
        testID="radio-option"
        onPress={() => onChange({ id: `option-${++pressCount}` })}
      />
    ),
  };
});

const RadioStep = 0;

// Minimal props for an auto-advancing radio question
const itemProps = {
  step: RadioStep,
  type: 'Radio',
  value: {},
  pipelineItem: {
    type: 'Radio',
    question: 'Question',
    payload: { autoAdvance: true, options: [] },
  },
  onAdditionalResponse: jest.fn(),
  textVariableReplacer: (markdown: string) => markdown,
  onContextChange: jest.fn(),
  context: {},
} as unknown as ComponentProps<typeof ActivityItem>;

const renderRadioItem = () => {
  let currentStep = RadioStep;

  const onResponse = jest.fn();

  // Moving to the next item changes the current step, like the real stepper
  const next = jest.fn(() => {
    currentStep++;
  });

  render(
    <TamaguiProvider>
      <HandlersContext.Provider
        value={{ next, back: jest.fn(), undo: jest.fn() }}
      >
        <ValuesContext.Provider
          value={{ getCurrentStep: () => currentStep, stepsCount: 3 }}
        >
          <ActivityItem {...itemProps} onResponse={onResponse} />
        </ValuesContext.Provider>
      </HandlersContext.Provider>
    </TamaguiProvider>,
  );

  return { onResponse, next };
};

describe('ActivityItem - auto-advancing radio', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should answer and move to the next item once on a single tap', async () => {
    const { onResponse, next } = renderRadioItem();

    fireEvent.press(screen.getByTestId('radio-option'));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(150);
    });

    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ fromStep: RadioStep }),
    );
  });

  it('Should ignore a second tap that lands after the item moved on', async () => {
    const { onResponse, next } = renderRadioItem();

    fireEvent.press(screen.getByTestId('radio-option'));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(50);
    });

    fireEvent.press(screen.getByTestId('radio-option'));

    await act(async () => {
      await jest.advanceTimersByTimeAsync(200);
    });

    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
