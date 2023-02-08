import { StyleSheet } from 'react-native';

import {
  RenderRules,
  renderRules as defaultRenderRules,
} from 'react-native-markdown-display';

import { colors } from '@shared/lib';
import { Box, Text } from '@shared/ui';

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
    return (
      <Text
        key={node.key}
        style={[
          inheritedStyles,
          styles.text,
          localStyles.text,
          { ...additionalStyles },
        ]}>
        {updatedNodeContent}
      </Text>
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

export default markDownRules;
