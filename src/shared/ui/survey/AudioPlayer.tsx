import { FC } from 'react';

import { palette } from '@app/shared/lib/constants/palette';
import { useAudioPlayer } from '@app/shared/lib/hooks/useAudioPlayer';

import { XStack } from '../base';
import { PauseIcon, PlayIcon } from '../icons';
import { SubmitButton } from '../SubmitButton';
import { Text } from '../Text';

type Props = {
  uri: string;
  title?: string;
};

export const AudioPlayer: FC<Props> = ({ uri, title }) => {
  const { isPlaying, togglePlay } = useAudioPlayer();

  return (
    <XStack ai="center" gap={12}>
      <SubmitButton
        aria-label="audio-player-btn"
        onPress={() => togglePlay(uri)}
        p={0}
        height={48}
        width={48}
        textProps={{ lineHeight: 30 }}
        mode="tonal"
      >
        {isPlaying ? (
          <PauseIcon
            aria-label="audio-player-pause"
            size={30}
            color={palette.on_secondary_container}
          />
        ) : (
          <PlayIcon
            aria-label="audio-player-play"
            size={30}
            color={palette.on_secondary_container}
          />
        )}
      </SubmitButton>

      {title && (
        <Text
          aria-label="audio-player-title"
          maxWidth="90%"
          fontSize={20}
          fontWeight="400"
        >
          {title}
        </Text>
      )}
    </XStack>
  );
};
