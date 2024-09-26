import { useState, useRef, useEffect, FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';
import AudioRecorderPlayer, {
  AudioSet,
} from 'react-native-audio-recorder-player';
import { FileSystem, Dirs } from 'react-native-file-access';
import { v4 as uuidv4 } from 'uuid';

import { handleBlockedPermissions } from '@app/shared/lib/alerts/permissionAlerts';
import { IS_ANDROID } from '@app/shared/lib/constants';
import { useMicrophonePermissions } from '@app/shared/lib/hooks/useMicrophonePermissions';
import { requestMicrophonePermissions } from '@app/shared/lib/permissions/microphonePermissions';
import { isLocalFileUrl } from '@app/shared/lib/utils/file';

import { XStack, YStack } from '../base';
import { MicrophoneIcon, StopIcon } from '../icons';
import { Text } from '../Text';

const audioSetConfig: AudioSet = {
  AVNumberOfChannelsKeyIOS: 1,
};
const androidCacheDir = Dirs.CacheDir;

type Response = {
  uri: string;
  fileName: string;
  type: string;
};

type Props = {
  config: {
    maxDuration?: number;
  };
  value?: Response;
  onChange: (response: Response) => void;
};

export const AudioRecorderItem: FC<Props> = ({
  config,
  onChange: onFinish,
  value: initialValue,
}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  audioRecorderPlayer.current.setSubscriptionDuration(0.1);
  const { t } = useTranslation();
  const { maxDuration = Infinity } = config;
  const { isMicrophoneAccessGranted } = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [errorDescription, setErrorDescription] = useState('');
  const [lastFilePath, setLastFilePath] = useState<string | null>(null);

  const destroy = () => {
    audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
  };

  const unlinkOldRecordingFile = async () => {
    const isUrlValid = Boolean(
      lastFilePath && (await FileSystem.exists(lastFilePath)),
    );
    if (isUrlValid) {
      try {
        await FileSystem.unlink(lastFilePath!);
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const generateNewFilePath = async () => {
    const randomString = uuidv4();
    const newFilePath = IS_ANDROID
      ? `${androidCacheDir}/${randomString}.mp4`
      : `${randomString}.m4a`;

    await unlinkOldRecordingFile();

    setLastFilePath(newFilePath);
    return newFilePath;
  };

  const record = async () => {
    try {
      const newFilePath = await generateNewFilePath();

      await audioRecorderPlayer.current.startRecorder(
        newFilePath,
        audioSetConfig,
      );

      audioRecorderPlayer.current.addRecordBackListener(
        ({ currentPosition }) => {
          const elapsedSeconds = Math.floor(currentPosition / 1000);
          setSecondsElapsed(elapsedSeconds);
          setIsRecording(true);

          if (maxDuration <= elapsedSeconds) {
            stop();
          }
        },
      );
    } catch (e) {
      setErrorDescription(t('audio_recorder:record_error'));
      destroy();
      console.error(e);
    }
  };

  const startRecord = async () => {
    if (isMicrophoneAccessGranted) {
      await record();
    } else {
      const isPermissionAllowed = await requestMicrophonePermissions();

      if (isPermissionAllowed) {
        await record();
      } else {
        await handleBlockedPermissions(
          t('audio_recorder:alert_title'),
          t('audio_recorder:alert_message'),
        );
      }
    }
  };

  const stop = async () => {
    try {
      const fullPath = await audioRecorderPlayer.current.stopRecorder();

      setIsRecording(false);

      if (!isLocalFileUrl(fullPath)) {
        return;
      }

      const name = fullPath
        ? fullPath.replace(/^(?:[^\/]*\/)*/, '').split('.')[0]
        : uuidv4();

      const response = {
        uri: fullPath,
        type: `audio/${IS_ANDROID ? 'm4a' : 'mp4'}`,
        fileName: `${name}.${IS_ANDROID ? 'm4a' : 'mp4'}`,
      };

      onFinish(response);
    } catch (e) {
      console.error(e);
    }
  };

  const renderIcon = () => {
    if (isRecording) {
      return <StopIcon size={17} color="white" />;
    } else {
      return <MicrophoneIcon size={20} color="white" />;
    }
  };

  const getButtonText = () => {
    if (isRecording) {
      return t('audio_recorder:stop');
    } else {
      return t('audio_recorder:record');
    }
  };

  const getInfoText = () => {
    if (isRecording) {
      return t('audio_recorder:recording');
    } else if (initialValue) {
      return t('audio_recorder:file_saved');
    }
  };

  useEffect(() => {
    return destroy;
  }, []);

  return (
    <>
      {errorDescription.length ? <Text mb={7}>{errorDescription}</Text> : null}

      <XStack ai="center">
        <TouchableOpacity
          accessibilityLabel="audio-record-btn"
          onPress={isRecording ? stop : startRecord}
        >
          <XStack
            h={50}
            minWidth={150}
            maxWidth={250}
            ai="center"
            jc="center"
            bg={isRecording ? '$alert' : '$primary'}
            p="$3"
            mr="$3"
          >
            <Text
              accessibilityLabel="audio-record-btn-text"
              mr="$2"
              color="$white"
              fontWeight="700"
              fontSize={16}
            >
              {getButtonText()}
            </Text>

            {renderIcon()}
          </XStack>
        </TouchableOpacity>

        <YStack>
          <Text accessibilityLabel="audio-record-info-text">
            {getInfoText()}
          </Text>

          {isRecording && (
            <Text accessibilityLabel="audio-record-status-text">{`${secondsElapsed} ${t(
              'audio_recorder:seconds',
            )}`}</Text>
          )}
        </YStack>
      </XStack>
    </>
  );
};
