import { FC, useCallback, useRef, useEffect } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { default as VideoPlayerBase } from 'react-native-video-player';

import { Center } from '@shared/ui';

const baseStyles = {
  height: 250,
  width: '100%',
  backgroundColor: '#000',
};

const customStyles = {
  video: baseStyles,
  wrapper: baseStyles,
  thumbnail: baseStyles,
};

type Props = {
  uri: string;
  resizeMode?: 'cover' | 'contain';
  autoPlay?: boolean;
};

const VideoPlayer: FC<Props> = ({
  uri,
  autoPlay = false,
  resizeMode = 'cover',
}) => {
  const playerRef = useRef<VideoPlayerBase>(null);

  useFocusEffect(
    useCallback(() => {
      return destroy;
    }, []),
  );

  useEffect(() => {
    return destroy;
  }, []);

  const destroy = () => {
    playerRef.current?.stop();
  };

  return (
    <Center flex={1} w="100%">
      <VideoPlayerBase
        ref={playerRef}
        video={{
          uri,
        }}
        autoplay={autoPlay}
        resizeMode={resizeMode}
        showDuration
        disableFullscreen
        pauseOnPress
        customStyles={customStyles}
        thumbnail={{ uri }}
      />
    </Center>
  );
};

export default VideoPlayer;
