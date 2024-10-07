import renderer from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import * as useAudioPlayerHooks from '@app/shared/lib/hooks/useAudioPlayer';

import { AudioPlayer } from '../AudioPlayer';

describe('Test AudioPlayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should render play button', () => {
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

  it('Should render pause button', () => {
    jest.spyOn(useAudioPlayerHooks, 'useAudioPlayer').mockReturnValue({
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
});
