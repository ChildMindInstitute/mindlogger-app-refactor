import { StyleSheet, Dimensions, Linking } from 'react-native';

import { CachedImage, CacheManager } from '@georstat/react-native-image-cache';
import { format } from 'date-fns';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {
  ASTNode,
  RenderRules,
  renderRules as defaultRenderRules,
} from 'react-native-markdown-display';
// @ts-ignore
import * as mime from 'react-native-mime-types';
import sanitizeHtml from 'sanitize-html';

import { Box, XStack } from '../../ui/base';
import { AudioPlayer } from '../../ui/survey/AudioPlayer';
import { VideoPlayer } from '../../ui/survey/VideoPlayer';
import { YoutubeVideo } from '../../ui/survey/YoutubeVideo';
import { Text } from '../../ui/Text';
import { palette } from '../constants/palette';

const { width: viewPortWidth } = Dimensions.get('window');
const PADDING_X = 32;

const localStyles = StyleSheet.create({
  alignLeftContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: viewPortWidth - 20,
    textAlign: 'left',
  },
  alignRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: viewPortWidth - 20,
    textAlign: 'right',
  },
  alignCenterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: viewPortWidth - 20,
    textAlign: 'center',
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
    color: palette.primary,
  },
  image: {
    height: 200,
    width: viewPortWidth - 100,
  },
  htmlWebView: {
    width: Dimensions.get('window').width,
  },
  listItemText: {
    fontSize: 18,
    fontWeight: '400',
  },
});

const listItemStyles = {
  bullet_list_icon: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    alignSelf: 'center',
    width: 8,
  },
  ordered_list_icon: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    alignSelf: 'center',
  },
  _VIEW_SAFE_ordered_list_content: {
    marginLeft: 3,
  },
  _VIEW_SAFE_bullet_list_content: {
    marginLeft: 3,
  },
};

export const activityMarkDownStyles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 18,
  },
  heading2: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 18,
  },
  heading3: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 18,
  },
  heading4: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 18,
  },
  heading5: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: 18,
  },
  heading6: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: 18,
  },
  paragraph: {
    alignSelf: 'center',
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 18,
  },
  text: {
    flexDirection: 'row',
  },
  blockquote: {
    backgroundColor: palette.surface_variant,
    borderLeftWidth: 4,
    borderLeftColor: palette.outline,
    paddingVertical: 0,
    paddingHorizontal: 5,
    marginLeft: 3,
  },
  fence: {
    color: '#000',
  },
});

const videoStyles = {
  height: 250,
  width: '100%',
  backgroundColor: '#000',
};

const htmlBlockStyles = `
  * {
    font-size: 22px;
    font-weight: 300;
    text-align: center;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
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

const AlignmentTags = [
  'container_hljs-left',
  'container_hljs-center',
  'container_hljs-right',
] as const;

type AlignmentTag = (typeof AlignmentTags)[number];

const AlignmentStyles = {
  'container_hljs-left': {
    textAlign: 'left',
  },
  'container_hljs-right': {
    textAlign: 'right',
  },
  'container_hljs-center': {
    textAlign: 'center',
  },
} as const satisfies Record<AlignmentTag, object>;

export const markDownRules: RenderRules = {
  'container_hljs-left': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignLeftContainer} gap={20}>
        {children}
      </Box>
    );
  },
  'container_hljs-center': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignCenterContainer} gap={20}>
        {children}
      </Box>
    );
  },
  'container_hljs-right': (node, children) => {
    return (
      <Box key={node.key} style={localStyles.alignRightContainer} gap={20}>
        {children}
      </Box>
    );
  },
  table: (node, children) => {
    return (
      <Box
        key={node.key}
        borderColor="$outline"
        borderTopWidth={0.5}
        borderLeftWidth={0.5}
        flex={1}
        width={viewPortWidth - PADDING_X}
      >
        {children}
      </Box>
    );
  },
  td: (node, children) => {
    return (
      <Box
        key={node.key}
        borderBottomWidth={0.5}
        borderRightWidth={0.5}
        borderColor="$outline"
        px={8}
        py={14}
        flex={1}
      >
        {children.map(child => (
          <Text textAlign="center">{child}</Text>
        ))}
      </Box>
    );
  },
  th: (node, children) => {
    return (
      <Box
        key={node.key}
        px={8}
        py={14}
        borderColor="$outline"
        borderBottomWidth={0.5}
        borderRightWidth={0.5}
        flex={1}
      >
        {children.map(child => (
          <Text textAlign="center" fontWeight="700">
            {child}
          </Text>
        ))}
      </Box>
    );
  },
  tr: (node, children) => {
    return <XStack key={node.key}>{children}</XStack>;
  },
  code_inline: node => {
    return (
      <Text
        fontFamily="$code"
        fontSize={15}
        backgroundColor="$surface_variant"
        color="$pink"
      >
        {node.content}
      </Text>
    );
  },
  text: (node, children, parents, styles, inheritedStyles = {}) => {
    const containerAlignTag = getContainerAlignTag(parents);

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
    const [, , wrapperParent] = parents;

    if (wrapperParent?.type === 'list_item') {
      inheritedStyles = {
        ...inheritedStyles,
        ...localStyles.listItemText,
      };
    }

    if (containerAlignTag) {
      const alignmentStyles = AlignmentStyles[containerAlignTag];

      additionalStyles = {
        ...additionalStyles,
        ...alignmentStyles,
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
      return (
        <Box key={`${node.key}-wrapper`} {...videoStyles}>
          <VideoPlayer
            uri={src}
            key={node.key}
            thumbnailStyle={videoStyles}
            videoStyle={videoStyles}
            wrapperStyle={videoStyles}
          />
        </Box>
      );
    } else if (isYoutubeVideo) {
      return <YoutubeVideo key={node.key} src={src} />;
    }

    const isCached = !!CacheManager.entries[node.attributes.src];

    return (
      <CachedImage
        key={node.key}
        resizeMode="contain"
        style={localStyles.image}
        source={node.attributes.src}
        sourceAnimationDuration={isCached ? 0 : 200}
      />
    );
  },
  paragraph: (node, children, parents, styles) => {
    const customContainerTagExists = checkIfContainerTypeIsHljs(parents);

    if (customContainerTagExists) {
      return <Box key={node.key}>{children}</Box>;
    }

    // @ts-ignore
    return defaultRenderRules.paragraph(node, children, parents, styles);
  },
  html_inline: (node, children) => {
    const isSafeTag = !!sanitizeHtml(node.content);

    return isSafeTag ? children : null;
  },
  html_block: node => {
    const htmlContent = sanitizeHtml(node.content);

    return (
      <AutoHeightWebView
        key={node.key}
        style={localStyles.htmlWebView}
        customStyle={htmlBlockStyles}
        source={{ html: htmlContent }}
        scrollEnabled={false}
        scalesPageToFit={false}
        allowsProtectedMedia
        mixedContentMode="always"
        viewportContent="width=device-width, user-scalable=no"
        onShouldStartLoadWithRequest={onHtmlBlockLinkPress}
        androidLayerType="hardware"
      />
    );
  },
  list_item: (node, children, parents, styles) => {
    const customContainerTagExists = checkIfContainerTypeIsHljs(parents);

    return (
      <Box key={node.key} my={customContainerTagExists ? 3 : -6}>
        {
          // @ts-ignore
          defaultRenderRules.list_item(node, children, parents, {
            ...styles,
            ...listItemStyles,
          })
        }
      </Box>
    );
  },
};

const styleVariables = (content: string) => {
  const regex = /(\^.+?\^)|(~.+?~)|(==.+?==)|(\+\+.+?\+\+)/g;
  const highlightRegex = /[=]=.+?==/g;
  const underlineRegex = /\+\+.+?\+\+/g;
  const superscriptRegex = /\^.+?\^/g;
  const subscriptRegex = /~.+?~/g;

  const strings = content.split(regex).filter(Boolean);

  return strings.map((text, index) => {
    if (highlightRegex.test(text)) {
      return <Text backgroundColor="yellow">{text.replace(/[==^]/g, '')}</Text>;
    }

    if (underlineRegex.test(text)) {
      return (
        <Text textDecorationLine="underline">{text.replace(/[++^]/g, '')}</Text>
      );
    }

    if (superscriptRegex.test(text)) {
      return (
        <Box h={28} key={`subscript-${index}`}>
          <Text fontSize={13}>{text.replace(/\^/g, '')}</Text>
        </Box>
      );
    }

    if (subscriptRegex.test(text)) {
      return (
        <Box h={28} key={`subscript-${index}`}>
          <Text fontSize={13} mt={14}>
            {text.replace(/[~]/g, '')}
          </Text>
        </Box>
      );
    }

    return text;
  });
};

const parseNodeContent = (content: string) => {
  return styleVariables(content);
};

const checkIfContainerTypeIsHljs = (parents: ASTNode[]) => {
  for (const parent of parents) {
    const { type } = parent;
    if (type.includes('container_hljs')) {
      return true;
    }
  }

  return false;
};

const getContainerAlignTag = (parents: ASTNode[]): AlignmentTag | undefined => {
  const tag = parents
    .map(parent => parent.type)
    .find((type): type is AlignmentTag =>
      (AlignmentTags as readonly string[]).includes(type),
    );

  return tag;
};

export const preprocessImageLinks = (content: string) => {
  return content?.replace(/(!\[.*\]\s*\(.*?) =\d*x\d*(\))/g, '$1$2');
};
