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
      <TouchableOpacity onPress={() => togglePlay(uri)}>
        <Box w={40} ai="center">
          {isPlaying ? (
            <PauseIcon size={30} color="black" />
          ) : (
            <PlayIcon size={30} color="black" />
          )}
        </Box>
      </TouchableOpacity>

      {title && (
        <Text maxWidth="90%" fontSize={20} fontWeight="500">
          {title}
        </Text>
      )}
    </XStack>
  );
};

export default AudioPlayer;
