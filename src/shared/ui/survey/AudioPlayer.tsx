import { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useAudioPlayer } from '@shared/lib';
import { PlayIcon, PauseIcon, XStack, Text, Box } from '@shared/ui';

type Props = {
  uri: string;
  title?: string;
};

const AudioPlayer: FC<Props> = ({ uri, title }) => {
  const { isPlaying, togglePlay } = useAudioPlayer();

  return (
    <XStack ai="center">
      <TouchableOpacity accessibilityLabel="audio-player-btn" onPress={() => togglePlay(uri)}>
        <Box w={40} ai="center">
          {isPlaying ? (
            <PauseIcon accessibilityLabel="audio-player-pause" size={30} color="black" />
          ) : (
            <PlayIcon accessibilityLabel="audio-player-play" size={30} color="black" />
          )}
        </Box>
      </TouchableOpacity>

      {title && (
        <Text accessibilityLabel="audio-player-title" maxWidth="90%" fontSize={20} fontWeight="500">
          {title}
        </Text>
      )}
    </XStack>
  );
};

export default AudioPlayer;
