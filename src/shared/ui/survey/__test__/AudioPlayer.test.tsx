import renderer from 'react-test-renderer';

import TamaguiProvider from '@app/app/ui/AppProvider/TamaguiProvider';
import * as hooks from '@shared/lib/hooks';
import { AudioPlayer } from '@shared/ui';

// jest.mock(
//   'react-native-audio-recorder-player',
//   () =>
//     function () {
//       return {
//         stopPlayer: jest.fn(),
//         removePlayBackListener: jest.fn(),
//         startPlayer: jest.fn(),
//         addPlayBackListener: jest.fn(),
//         pausePlayer: jest.fn(),
//         setSubscriptionDuration: jest.fn(),
//       };
//     },
// );

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

describe('AudioPlayer', () => {
  it('should render play button', () => {
    const audioPlayer = renderer.create(
      <TamaguiProvider>
        <AudioPlayer uri="http://dummyUrl.com/audio" />
      </TamaguiProvider>,
    );

    const playButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-player-play',
    });

    expect(!!playButton).toBe(true);
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
        <AudioPlayer uri="http://dummyUrl.com/audio" />
      </TamaguiProvider>,
    );

    const pauseButton = audioPlayer.root.findByProps({
      accessibilityLabel: 'audio-player-pause',
    });

    expect(!!pauseButton).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
