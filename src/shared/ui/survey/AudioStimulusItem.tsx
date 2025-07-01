import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { palette } from '@app/shared/lib/constants/palette';
import { useAudioPlayer } from '@app/shared/lib/hooks/useAudioPlayer';

import { CheckIcon, PlayIcon, SpeakerIcon, StopIcon } from '../icons';
import { SubmitButton } from '../SubmitButton';

type Props = {
  config: {
    file: string;
    playOnce: boolean;
  };
  value: boolean;
  onChange: (value: boolean) => void;
};

export const AudioStimulusItem: FC<Props> = ({
  config,
  onChange: onFinish,
}) => {
  const { file: uri, playOnce } = config;
  const replayIsAllowed = !playOnce;

  const { t } = useTranslation();

  const { isPlaying, playbackCount, play, pause, isLoading } = useAudioPlayer();

  const renderIcon = () => {
    if (isPlaying) {
      if (replayIsAllowed) {
        return <StopIcon size={18} color={palette.on_secondary_container} />;
      } else {
        return <SpeakerIcon size={18} color={palette.on_secondary_container} />;
      }
    } else if (replayIsAllowed || playbackCount === 0) {
      return <PlayIcon size={26} color={palette.on_secondary_container} />;
    } else {
      return <CheckIcon size={18} color={palette.on_secondary_container} />;
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return t('audio_player:loading');
    }
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
      pause().catch(console.error);
    } else if (canPlay) {
      play(uri, () => onFinish(true)).catch(console.error);
    }
  };

  const isInactive = !replayIsAllowed && (isPlaying || playbackCount > 0);

  return (
    <>
      <SubmitButton
        accessibilityLabel="audio-stimulus-btn"
        disabled={isLoading || isInactive}
        isLoading={isLoading}
        onPress={onPress}
        minWidth={150}
        mode="tonal"
        alignSelf="center"
        rightIcon={renderIcon()}
      >
        {getButtonText()}
      </SubmitButton>
    </>
  );
};
