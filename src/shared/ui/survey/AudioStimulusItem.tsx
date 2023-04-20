import { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAudioPlayer } from '@shared/lib';
import {
  PlayIcon,
  StopIcon,
  CheckIcon,
  SpeakerIcon,
  XStack,
  Text,
} from '@shared/ui';

type Props = {
  config: {
    file: string;
    playOnce: boolean;
  };
  value: boolean;
  onChange: (value: boolean) => void;
};

const AudioStimulusItem: FC<Props> = ({ config, onChange: onFinish }) => {
  const { file: uri, playOnce } = config;
  const replayIsAllowed = !playOnce;

  const { t } = useTranslation();

  const { isPlaying, playbackCount, play, pause } = useAudioPlayer();

  const renderIcon = () => {
    if (isPlaying) {
      if (replayIsAllowed) {
        return <StopIcon size={17} color="white" />;
      } else {
        return <SpeakerIcon size={20} color="white" />;
      }
    } else if (replayIsAllowed || playbackCount === 0) {
      return <PlayIcon size={25} color="white" />;
    } else {
      return <CheckIcon size={20} color="white" />;
    }
  };

  const getButtonText = () => {
    if (isPlaying) {
      if (replayIsAllowed) {
        return t('audio_player:stop');
      } else {
        return t('audio_player:playing');
      }
    } else {
      return t('audio_player:play');
    }
  };

  const onPress = () => {
    const canPause = isPlaying && replayIsAllowed;
    const canPlay = replayIsAllowed || playbackCount === 0;

    if (canPause) {
      pause();
    } else if (canPlay) {
      play(uri, () => onFinish(true));
    }
  };

  const isInActive = !replayIsAllowed && (isPlaying || playbackCount > 0);

  return (
    <>
      <TouchableOpacity disabled={isInActive} onPress={onPress}>
        <XStack
          h={50}
          w={150}
          ai="center"
          jc="center"
          bg="$primary"
          p="$3"
          opacity={isInActive ? 0.5 : 1}
        >
          <Text mr="$2" color="$white" fontWeight="700" fontSize={16}>
            {getButtonText()}
          </Text>

          {renderIcon()}
        </XStack>
      </TouchableOpacity>
    </>
  );
};

export default AudioStimulusItem;
