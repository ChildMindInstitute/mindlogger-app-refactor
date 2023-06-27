import { useState, useRef, useEffect, useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const SUBSCRIPTION_DURATION = 500;

const useAudioPlayer = () => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackCount, setPlaybackCount] = useState(0);

  const destroy = () => {
    setIsPlaying(false);
    audioRecorderPlayer.current.stopPlayer();
    audioRecorderPlayer.current.removePlayBackListener();
  };

  const play = async (uri: string, onFinish?: () => void) => {
    setIsPlaying(true);

    await audioRecorderPlayer.current.startPlayer(encodeURI(uri));

    audioRecorderPlayer.current.addPlayBackListener(data => {
      if (data.currentPosition >= data.duration - SUBSCRIPTION_DURATION) {
        setIsPlaying(false);
        setPlaybackCount(playbackCount + 1);
        if (onFinish) {
          onFinish();
        }
      }
    });
  };

  const pause = () => {
    setIsPlaying(false);

    return audioRecorderPlayer.current.pausePlayer();
  };

  const togglePlay = async (uri: string, onFinish?: () => void) => {
    if (isPlaying) {
      await pause();
    } else if (!isPlaying) {
      await play(encodeURI(uri), onFinish);
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

  return { play, pause, togglePlay, destroy, isPlaying, playbackCount };
};

export default useAudioPlayer;
