import renderer from 'react-test-renderer';

import { TamaguiProvider } from '@app/app/ui/AppProvider/TamaguiProvider';
import * as useAudioPlayerHooks from '@app/shared/lib/hooks/useAudioPlayer';

import { ActivityIndicator } from '../../ActivityIndicator';
import { AudioStimulusItem } from '../AudioStimulusItem';

describe('Test AudioStimulusItem', () => {
  it('Should render play button', () => {
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

  it('Should render activity indicator while loading', () => {
    jest.spyOn(useAudioPlayerHooks, 'useAudioPlayer').mockReturnValue({
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

  it('Should render correct button text if replay is not allowed', () => {
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
});
