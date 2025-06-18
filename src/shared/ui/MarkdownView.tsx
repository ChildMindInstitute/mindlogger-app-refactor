import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

import markdownContainer from 'markdown-it-container';
import Markdown, {
  RenderRules,
  MarkdownIt,
} from 'react-native-markdown-display';

import { defaultFont, elFont } from '../config/theme/tamagui.config';
import { useFontLanguage } from '../hooks/useFontLanguage';
import { IS_ANDROID } from '../lib/constants';
import { preprocessImageLinks } from '../lib/markdown/rules';

const markdownItInstance = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(markdownContainer)
  .use(markdownContainer, 'hljs-left')
  .use(markdownContainer, 'hljs-center')
  .use(markdownContainer, 'hljs-right');

type Props = {
  content: string;
  markdownStyle: StyleSheet.NamedStyles<any>;
  rules?: RenderRules;
};

declare module 'react-native-markdown-display' {
  interface MarkdownProps {
    children: string;
  }
}

export const MarkdownView: FC<Props> = ({ content, markdownStyle, rules }) => {
  const fontLanguage = useFontLanguage();

  const style: StyleSheet.NamedStyles<any> = {
    ...markdownStyle,
    text: {
      fontFamily: fontLanguage === 'el' ? elFont.family : defaultFont.family,
      ...markdownStyle.text,
    },
    body: {
      fontSize: 16,
      lineHeight: 20,
    },
    ...(fontLanguage === 'el'
      ? {
          strong: {
            fontFamily: elFont.face[700].normal,
            // Android will not use the correct asset if fontWeight is set to "bold", unclear why
            ...(IS_ANDROID ? { fontWeight: 'normal' } : {}),
            ...markdownStyle.strong,
          },
          em: {
            fontFamily: elFont.face[400].italic,
            // Android will not use the correct asset if fontStyle is set to "italic", unclear why
            ...(IS_ANDROID ? { fontStyle: 'normal' } : {}),
            ...markdownStyle.em,
          },
        }
      : {}),
  };

  return (
    <Markdown
      rules={rules}
      mergeStyle
      markdownit={markdownItInstance}
      style={style}
    >
      {preprocessImageLinks(content)}
    </Markdown>
  );
};
