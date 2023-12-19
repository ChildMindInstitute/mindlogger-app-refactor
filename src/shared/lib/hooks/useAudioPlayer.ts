import { useState, useRef, useEffect, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { IS_ANDROID, wait } from '@shared/lib';

const SUBSCRIPTION_DURATION = 500;

const useAudioPlayer = () => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState<null | boolean>(null);
  const [playbackCount, setPlaybackCount] = useState(0);

  const destroy = () => {
    setIsPlaying(false);
    audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
  };

  const play = async (uri: string, onFinish?: () => void) => {
    if (!IS_ANDROID || isLoading === null) {
      setIsLoading(true);
    }

    await wait(100);

    await audioRecorderPlayer.current.startPlayer(uri);

    setIsPlaying(true);

    if (IS_ANDROID) {
      setIsLoading(false);
    }

    audioRecorderPlayer.current.addPlayBackListener(data => {
      setIsLoading(false);
      if (data.currentPosition >= data.duration - SUBSCRIPTION_DURATION) {
        setIsPlaying(false);
        setIsLoading(false);
        setPlaybackCount(playbackCount + 1);
        if (onFinish) {
          onFinish();
        }
      }
    });
  };

  const pause = () => {
    setIsPlaying(false);

    if (IS_ANDROID) {
      return audioRecorderPlayer.current.pausePlayer();
    }

    return audioRecorderPlayer.current.stopPlayer();
  };

  const togglePlay = async (uri: string, onFinish?: () => void) => {
    if (isPlaying) {
      await pause();
    } else if (!isPlaying) {
      play(uri, onFinish);
    }
  };

  useEffect(() => {
    audioRecorderPlayer.current.setSubscriptionDuration(SUBSCRIPTION_DURATION);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return destroy;
    }, []),
  );

  useEffect(() => {
    return destroy;
  }, []);

  return {
    play,
    pause,
    togglePlay,
    destroy,
    isPlaying,
    playbackCount,
    isLoading,
  };
};

export default useAudioPlayer;
