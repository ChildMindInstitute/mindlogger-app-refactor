import { StyleSheet, Dimensions, Linking } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { format } from 'date-fns';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {
  RenderRules,
  renderRules as defaultRenderRules,
} from 'react-native-markdown-display';
// @ts-ignore
import * as mime from 'react-native-mime-types';

import { Box, Text, AudioPlayer, VideoPlayer, YoutubeVideo } from '@shared/ui';

import { colors } from './constants';

const { width: viewPortWidth } = Dimensions.get('window');

const localStyles = StyleSheet.create({
  alignLeftContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  alignRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  alignCenterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  text: {
    flexDirection: 'row',
  },
  markedText: {
    backgroundColor: 'yellow',
  },
  primaryText: {
    color: colors.primary,
  },
  image: {
    height: 200,
    width: viewPortWidth - 100,
  },
  htmlWebView: {
    width: '100%',
  },
  listItemText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export const activityMarkDownStyles = StyleSheet.create({
  heading1: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading3: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading4: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading5: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  heading6: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  paragraph: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '300',
  },
  text: {
    flexDirection: 'row',
  },
  blockquote: {
    backgroundColor: colors.lighterGrey2,
    borderLeftWidth: 4,
    borderLeftColor: colors.mediumGrey,
    paddingVertical: 0,
    paddingHorizontal: 5,
    marginLeft: 3,
  },
});

const htmlBlockStyles = `
  * {
    font-size: 22px;
    font-weight: 300;
    text-align: center;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    margin-bottom: 18px;
    text-align: left;
  }

  h1 {
    font-size: 36px;
  }

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 20px;
  }

  h5 {
    font-size: 18px;
  }

  h6 {
    font-size: 16px;
  }

  p {
    text-align: center;
    font-size: 22px;
    font-weight: 300;
  }

  a {
    text-decoration: underline;
  }

  img {
    object-fit: contain;
    width: calc(100vw - 80px);
    margin: 0px 40px;
  }

  table {
    width: 100%;
    border: 1px solid;
    border-collapse: collapse;
  }

  tr {
    border-bottom: 1px solid black;
  }

  td {
    font-size: 14px;
    text-align: left;
  }
`;

const onHtmlBlockLinkPress = (request: { url: string }) => {
  if (request.url !== 'about:blank') {
    Linking.openURL(request.url);
    return false;
  }
  return true;
};

const markDownRules: RenderRules = {
  'container_hljs-left': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignLeftContainer}>
        {children}
      </Box>
    );
  },
  'container_hljs-center': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignCenterContainer}>
        {children}
      </Box>
    );
  },
  'container_hljs-right': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignRightContainer}>
        {children}
      </Box>
    );
  },
  text: (node, children, parent, styles, inheritedStyles = {}) => {
    let additionalStyles = {};
    let updatedNodeContent = node.content;
    if (node.content.startsWith('++') && node.content.endsWith('++')) {
      updatedNodeContent = node.content.replace(/[+]+/g, '');
      additionalStyles = localStyles.underline;
    }
    if (node.content.startsWith('==') && node.content.endsWith('==')) {
      updatedNodeContent = node.content.replace(/[=]=/g, '');
      additionalStyles = localStyles.markedText;
    }
    if (node.content?.includes('[blue]')) {
      additionalStyles = localStyles.primaryText;
      updatedNodeContent = node.content.replace('[blue]', '');
    }

    const todayDate = format(new Date(), 'MM/dd/yyyy');
    updatedNodeContent = updatedNodeContent
      .replace(/<([^‘]*[a-zA-Z]+[^‘]*)>/gi, '')
      .replace(/\[\[sys.date]]/i, todayDate);
    const [, , wrapperParent] = parent;

    if (wrapperParent?.type === 'list_item') {
      inheritedStyles = {
        ...inheritedStyles,
        ...localStyles.listItemText,
      };
    }

    return (
      <Text
        key={node.key}
        style={[
          inheritedStyles,
          styles.text,
          localStyles.text,
          { ...additionalStyles },
        ]}
      >
        {parseNodeContent(updatedNodeContent)}
      </Text>
    );
  },
  image: node => {
    const src = node.attributes?.src;
    const mimeType = mime.lookup(src) || '';

    const isAudio = mimeType.startsWith('audio/');
    const isVideo =
      mimeType.startsWith('video/') || src?.includes('.quicktime');
    const isYoutubeVideo = src?.includes('youtu');

    if (isAudio) {
      return <AudioPlayer uri={src} title={node.content} key={node.key} />;
    } else if (isVideo) {
      return <VideoPlayer uri={src} key={node.key} />;
    } else if (isYoutubeVideo) {
      return <YoutubeVideo key={node.key} src={src} />;
    }

    return (
      <CachedImage
        key={node.key}
        resizeMode="contain"
        style={localStyles.image}
        source={node.attributes.src}
      />
    );
  },
  paragraph: (node, children, parents, styles) => {
    let customContainerTagExists = false;

    for (let parent of parents) {
      const { type } = parent;
      if (type.includes('container_hljs')) {
        customContainerTagExists = true;
        break;
      }
    }

    if (customContainerTagExists) {
      return <Box key={node.key}>{children}</Box>;
    }

    // @ts-ignore
    return defaultRenderRules.paragraph(node, children, parents, styles);
  },
  html_block: node => {
    return (
      <AutoHeightWebView
        key={node.key}
        style={localStyles.htmlWebView}
        customStyle={htmlBlockStyles}
        source={{ html: node.content }}
        scrollEnabled={false}
        scalesPageToFit={false}
        viewportContent="width=device-width, user-scalable=no"
        onShouldStartLoadWithRequest={onHtmlBlockLinkPress}
      />
    );
  },
  list_item: (node, children, parents, styles) => {
    return (
      <Box key={node.key} my={-10}>
        {
          // @ts-ignore
          defaultRenderRules.list_item(node, children, parents, styles)
        }
      </Box>
    );
  },
};

const styleVariables = (content: string) => {
  const regex = /(\^\S+?\^)|(~\S+?~)/g;
  const tildaRegex = /~\S+?~/g;
  const strings = content.split(regex).filter(Boolean);

  return strings.map((text, index) => {
    const isTildaVariable = tildaRegex.test(text);

    return !regex.test(text) ? (
      text
    ) : (
      <Box h={28} key={`subscript-${index}`}>
        <Text fontSize={13} mt={isTildaVariable ? 14 : 0}>
          {text.replace(/[~^]/g, '')}
        </Text>
      </Box>
    );
  });
};

const parseNodeContent = (content: string) => {
  return styleVariables(content);
};

export default markDownRules;
