import { useState, useRef, useEffect, useCallback, useMemo, FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AudioRecorderPlayer, {
  AudioSet,
} from 'react-native-audio-recorder-player';
import Permissions, { RESULTS } from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { getMicrophonePermissions, IS_ANDROID } from '@app/shared/lib';
import {
  useMicrophonePermissions,
  handleBlockedPermissions,
} from '@shared/lib';
import { StopIcon, MicrophoneIcon, XStack, Text, YStack } from '@shared/ui';

const audioSetConfig: AudioSet = {
  AVNumberOfChannelsKeyIOS: 1,
};
const androidCacheDir = RNFetchBlob.fs.dirs.CacheDir;

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

const AudioRecorderItem: FC<Props> = ({
  config,
  onChange: onFinish,
  value: initialValue,
}) => {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const { t } = useTranslation();
  const { maxDuration = Infinity } = config;
  const microphonePermission = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [fileSaved, setFileSaved] = useState(!!initialValue);
  const [errorDescription, setErrorDescription] = useState('');
  const permissionNotGranted = microphonePermission !== RESULTS.GRANTED;

  const filePath = useMemo(() => {
    if (initialValue?.uri) {
      return initialValue.uri;
    }
    const randomString = uuidv4();
    return IS_ANDROID
      ? `${androidCacheDir}/${randomString}.mp4`
      : `${randomString}.m4a`;
  }, [initialValue]);

  const checkMicrophonePermission = async () => {
    if (permissionNotGranted) {
      const result = await getMicrophonePermissions();

      if (result === Permissions.RESULTS.BLOCKED) {
        return await handleBlockedPermissions(
          t('audio_recorder:alert_title'),
          t('audio_recorder:alert_message'),
        );
      }
    }
    return true;
  };

  const destroy = () => {
    audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
  };

  const record = async () => {
    const canRecord = await checkMicrophonePermission();

    if (!canRecord) {
      return;
    }

    try {
      await audioRecorderPlayer.current.startRecorder(filePath, audioSetConfig);
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
    }
  };

  const stop = async () => {
    const fullPath = await audioRecorderPlayer.current.stopRecorder();
    audioRecorderPlayer.current.removeRecordBackListener();
    setIsRecording(false);
    setFileSaved(true);
    const response = {
      uri: fullPath,
      type: 'audio/m4a',
      fileName: `${uuidv4()}.m4a`,
    };
    onFinish(response);
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
    } else if (fileSaved) {
      return t('audio_recorder:file_saved');
    }
  };

  useEffect(() => {
    return destroy;
  }, []);

  useFocusEffect(
    useCallback(() => {
      return destroy;
    }, []),
  );

  return (
    <>
      {errorDescription.length ? <Text mb={7}>{errorDescription}</Text> : null}

      <XStack ai="center">
        <TouchableOpacity onPress={isRecording ? stop : record}>
          <XStack
            h={50}
            w={150}
            ai="center"
            jc="center"
            bg={isRecording ? '$alert' : '$primary'}
            p="$3"
            mr="$3"
          >
            <Text mr="$2" color="$white" fontWeight="700" fontSize={16}>
              {getButtonText()}
            </Text>

            {renderIcon()}
          </XStack>
        </TouchableOpacity>

        <YStack>
          <Text>{getInfoText()}</Text>

          {isRecording && (
            <Text>{`${secondsElapsed} ${t('audio_recorder:seconds')}`}</Text>
          )}
        </YStack>
      </XStack>
    </>
  );
};

export default AudioRecorderItem;
