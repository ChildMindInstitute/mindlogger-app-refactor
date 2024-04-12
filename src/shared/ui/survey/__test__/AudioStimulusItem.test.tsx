import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import * as hooks from '@shared/lib/hooks';
import { ActivityIndicator, AudioStimulusItem } from '@shared/ui';

jest.mock(
  'react-native-audio-recorder-player',
  () =>
    function () {
      return {
        stopPlayer: jest.fn(),
        removePlayBackListener: jest.fn(),
        startPlayer: jest.fn(),
        addPlayBackListener: jest.fn(),
        pausePlayer: jest.fn(),
        setSubscriptionDuration: jest.fn(),
      };
    },
);

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('@app/shared/lib/hooks/useAudioPlayer', () =>
  jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    togglePlay: jest.fn(),
    destroy: jest.fn(),
    isPlaying: false,
    playbackCount: 1,
    isLoading: false,
  })),
);

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn().mockImplementation(() => ({
    t: jest.fn().mockImplementation((key: string) => key),
  })),
}));

describe('AudioStimulusItem', () => {
  it('should render play button', () => {
    const audioPlayer = renderer.create(
      <TamaguiProvider>
        <AudioStimulusItem
          config={{
            file: '',
            playOnce: false,
          }}
          value={false}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const playButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-record-btn-text',
    });

    expect(playButton.props.children).toBe('audio_player:play');
  });

  it('should render pause button', () => {
    jest.spyOn(hooks, 'useAudioPlayer').mockReturnValue({
      play: jest.fn(),
      pause: jest.fn(),
      togglePlay: jest.fn(),
      destroy: jest.fn(),
      isPlaying: true,
      playbackCount: 0,
      isLoading: false,
    });

    const audioPlayer = renderer.create(
      <TamaguiProvider>
        <AudioStimulusItem
          config={{
            file: '',
            playOnce: false,
          }}
          value={false}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const playButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-record-btn-text',
    });

    expect(playButton.props.children).toBe('audio_player:stop');
  });

  it('should render activity indicator while loading', () => {
    jest.spyOn(hooks, 'useAudioPlayer').mockReturnValue({
      play: jest.fn(),
      pause: jest.fn(),
      togglePlay: jest.fn(),
      destroy: jest.fn(),
      isPlaying: false,
      playbackCount: 0,
      isLoading: true,
    });

    const audioPlayer = renderer.create(
      <TamaguiProvider>
        <AudioStimulusItem
          config={{
            file: '',
            playOnce: false,
          }}
          value={false}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const activityIndicator = audioPlayer.root.findByType(ActivityIndicator);
    const playButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-record-btn-text',
    });

    expect(Boolean(activityIndicator)).toBe(true);
    expect(playButton.props.children).toBe('audio_player:loading');
  });

  it('should render correct button text if replay is not allowed', () => {
    jest.spyOn(hooks, 'useAudioPlayer').mockReturnValue({
      play: jest.fn(),
      pause: jest.fn(),
      togglePlay: jest.fn(),
      destroy: jest.fn(),
      isPlaying: true,
      playbackCount: 0,
      isLoading: false,
    });

    const audioPlayer = renderer.create(
      <TamaguiProvider>
        <AudioStimulusItem
          config={{
            file: '',
            playOnce: true,
          }}
          value={false}
          onChange={jest.fn()}
        />
      </TamaguiProvider>,
    );

    const playButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-record-btn-text',
    });

    expect(playButton.props.children).toBe('audio_player:playing');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
