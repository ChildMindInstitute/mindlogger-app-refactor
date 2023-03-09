import { FC, useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

import { PlayIcon, PauseIcon, XStack, Text } from '@shared/ui';

type Props = {
  uri: string;
  title?: string;
};

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPlayer: FC<Props> = ({ uri, title }) => {
  const [playing, setPlaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPlaying(false);
        audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
      };
    }, []),
  );

  const togglePlay = async () => {
    if (playing) {
      await pause();
    } else if (!playing) {
      await play();
    }
  };

  const play = async () => {
    setPlaying(true);

    await audioRecorderPlayer.startPlayer(uri);
    audioRecorderPlayer.addPlayBackListener(data => {
      if (data.currentPosition === data.duration) {
        setPlaying(false);
      }
    });
  };

  const pause = async () => {
    setPlaying(false);

    await audioRecorderPlayer.pausePlayer();
  };

  return (
    <XStack ai="center">
      {title && (
        <Text maxWidth="90%" fontSize={20} fontWeight="500">
          {title}
        </Text>
      )}

      <TouchableOpacity onPress={togglePlay} style={styles.iconWrapper}>
        {playing ? (
          <PauseIcon size={30} color="black" />
        ) : (
          <PlayIcon size={30} color="black" />
        )}
      </TouchableOpacity>
    </XStack>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    width: 40,
  },
});

export default AudioPlayer;
