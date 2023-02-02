import { StyleSheet } from 'react-native';

import { RenderRules } from 'react-native-markdown-display';

import { XStack } from '@shared/ui';

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
});

const markDownRules: RenderRules = {
  'container_hljs-left': (node, children) => {
    return (
      <XStack key={node.key} style={localStyles.alignLeftContainer}>
        {children}
      </XStack>
    );
  },
  'container_hljs-center': (node, children) => {
    return (
      <XStack key={node.key} style={localStyles.alignCenterContainer}>
        {children}
      </XStack>
    );
  },
  'container_hljs-right': (node, children) => {
    return (
      <XStack key={node.key} style={localStyles.alignRightContainer}>
        {children}
      </XStack>
    );
  },
};

export default markDownRules;
