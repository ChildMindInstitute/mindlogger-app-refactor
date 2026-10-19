import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render } from '@testing-library/react-native';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import { HandlersContext } from '@app/shared/ui/Stepper/contexts';

import { ActivityItem } from './ActivityItem';
import { RadioPipelineItem } from '../lib/types/payload';

jest.mock('@app/entities/unity/ui/UnityView', () => ({}));

const options: RadioPipelineItem['payload']['options'] = [0, 1].map(value => ({
  id: `option-${value}`,
  text: `Option ${value}`,
  value,
  image: null,
  score: null,
  tooltip: null,
  color: null,
  isHidden: false,
  alert: null,
}));

const pipelineItem: RadioPipelineItem = {
  id: 'question-0',
  type: 'Radio',
  timer: null,
  isSkippable: false,
  payload: {
    options,
    randomizeOptions: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    autoAdvance: true,
    isGridView: false,
    shouldIdentifyResponse: false,
  },
};

function renderRadioItem(item = pipelineItem) {
  const next = jest.fn();
  const onResponse = jest.fn();
  // Avoid cache-expiry timers keeping Jest alive after component cleanup.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { cacheTime: Infinity } },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider>
        <HandlersContext.Provider
          value={{ next, back: jest.fn(), undo: jest.fn() }}
        >
          <ActivityItem
            type="Radio"
            pipelineItem={item}
            value={{}}
            onResponse={onResponse}
            onAdditionalResponse={jest.fn()}
            textVariableReplacer={text => text}
            onContextChange={jest.fn()}
            context={{}}
          />
        </HandlersContext.Provider>
      </TamaguiProvider>
    </QueryClientProvider>,
  );

  return {
    ...view,
    next,
    onResponse,
  };
}

describe('ActivityItem radio auto-advance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('advances only once when two radio options are pressed within 100 ms', async () => {
    const { getByText, next, onResponse } = renderRadioItem();

    fireEvent.press(getByText('Option 0'));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(50);
    });
    fireEvent.press(getByText('Option 1'));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(200);
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(onResponse).toHaveBeenCalledTimes(1);
    expect(onResponse).toHaveBeenCalledWith(options[1]);
  });
});
