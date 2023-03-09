import { StyleSheet, Dimensions } from 'react-native';

import { CachedImage } from '@georstat/react-native-image-cache';
import { format } from 'date-fns';
import {
  RenderRules,
  renderRules as defaultRenderRules,
} from 'react-native-markdown-display';
// @ts-ignore
import * as mime from 'react-native-mime-types';

import { colors } from '@shared/lib';
import { Box, Text, AudioPlayer } from '@shared/ui';
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
    fontSize: 22,
    fontWeight: '300',
  },
  text: {
    flexDirection: 'row',
  },
});

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
    const src = node?.attributes?.src;
    const mimeType = mime.lookup(src);
    if (!mimeType) {
      return null;
    }
    if (mimeType.startsWith('audio/')) {
      return <AudioPlayer uri={src} title={node.content} key={node.key} />;
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
