import { FC, useCallback, useRef, useEffect } from 'react';
import { StyleProp, StyleSheet } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { default as VideoPlayerBase } from 'react-native-video-player';

import { Center } from '@shared/ui';

const styles = StyleSheet.create({
  base: { width: '100%', height: '100%', backgroundColor: '#000' },
});

type Props = {
  uri: string;
  resizeMode?: 'cover' | 'contain';
  autoPlay?: boolean;
  videoStyle?: StyleProp<any>;
  wrapperStyle?: StyleProp<any>;
  thumbnailStyle?: StyleProp<any>;
};

const emptyStyles = StyleSheet.create({});

const VideoPlayer: FC<Props> = ({
  uri,
  autoPlay = false,
  resizeMode = 'cover',
  videoStyle = emptyStyles,
  wrapperStyle = emptyStyles,
  thumbnailStyle = emptyStyles,
}) => {
  const playerRef = useRef<VideoPlayerBase>(null);

  const mergeStyles = (styleProp: StyleProp<any>): StyleProp<any> => {
    return StyleSheet.compose(styles.base, styleProp);
  };

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

  useEffect(() => {
    if (!autoPlay) {
      playerRef.current?.pause();
    }
  }, [autoPlay, playerRef]);

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
        pauseOnPress
        customStyles={{
          wrapper: mergeStyles(wrapperStyle),
          thumbnail: mergeStyles(thumbnailStyle),
          video: mergeStyles(videoStyle),
        }}
        thumbnail={{ uri }}
      />
    </Center>
  );
};

export default VideoPlayer;
