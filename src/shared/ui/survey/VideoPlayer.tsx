import { FC, useCallback, useRef, useEffect } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { default as VideoPlayerBase } from 'react-native-video-player';

import { Center } from '@shared/ui';

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

  useEffect(() => {
    if (!autoPlay) {
      playerRef.current?.pause();
    }
  }, [autoPlay, playerRef]);

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
        autoplay
        resizeMode={resizeMode}
        showDuration
        disableFullscreen
        pauseOnPress
        customStyles={{
          video: {
            height: 250,
            width: '100%',
          },
          wrapper: {
            height: 250,
            width: '100%',
          },
        }}
      />
    </Center>
  );
};

export default VideoPlayer;
