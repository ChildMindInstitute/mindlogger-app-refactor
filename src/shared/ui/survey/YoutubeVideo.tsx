import { FC } from 'react';

import WebView from 'react-native-webview';

type Props = {
  src: string;
};

const YoutubeVideo: FC<Props> = ({ src }) => {
  const videoId = src.split('.be/')?.[1];
  const uri = src?.includes('watch?')
    ? src
    : `https://www.youtube.com/embed/${videoId}`;

  return (
    <WebView
      accessibilityLabel="youtube-video"
      width="100%"
      height={250}
      androidLayerType="hardware"
      mediaPlaybackRequiresUserAction
      source={{
        uri,
      }}
    />
  );
};

export default YoutubeVideo;
