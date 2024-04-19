import { useState, useRef, useEffect, FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';
import AudioRecorderPlayer, {
  AudioSet,
} from 'react-native-audio-recorder-player';
import { FileSystem, Dirs } from 'react-native-file-access';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import {
  useMicrophonePermissions,
  handleBlockedPermissions,
  isLocalFileUrl,
  IS_ANDROID,
  requestMicrophonePermissions,
  Logger,
} from '@shared/lib';
import { StopIcon, MicrophoneIcon, XStack, Text, YStack } from '@shared/ui';

const audioSetConfig: AudioSet = {
  AVNumberOfChannelsKeyIOS: 1,
};
const androidCacheDir = Dirs.CacheDir;

type Response = {
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

const AudioRecorderItem: FC<Props> = ({
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
        throw Error(
          `[AudioRecorderItem]: Provided path "${fullPath}" does not correspond application format requirements:
          /^(file:\/\/|\/).*\/[^\/]+?\.(jpg|jpeg|png|gif|mp4|m4a|mov|MOV|svg|mpeg)$/
          `,
        );
      }

      const fileNameRegex = /^file:\/\/(?:.*\/)?([^/]+)$/;

      const match = fullPath.match(fileNameRegex);

      if (!match) {
        throw Error(
          `[AudioRecorderItem]: File name can not be retrieved from path: ${fullPath}`,
        );
      }

      const fileName = match[1];
      const fileExtension = fileName.split('.')[1];

      const response = {
        type: `audio/${fileExtension}`,
        fileName,
      };

      onFinish(response);
    } catch (error) {
      Logger.error(
        `[AudioRecorderItem]: Error occurred during the recording process:
        ${error}`,
      );
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

export default AudioRecorderItem;
