import React, { FC, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import markdownContainer from 'markdown-it-container';
import Markdown, {
  RenderRules,
  MarkdownIt,
} from 'react-native-markdown-display';

import { preprocessImageLinks } from '../lib';

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
  markdownStyle?: StyleSheet.NamedStyles<any>;
  rules?: RenderRules;
};

declare module 'react-native-markdown-display' {
  interface MarkdownProps {
    children: string;
  }
}

const MarkdownView: FC<Props> = ({ content, markdownStyle, rules }) => {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    preprocessImageLinks(content).then(result => {
      setProcessedContent(result);
    });
  }, [content]);

  return (
    <Markdown
      rules={rules}
      mergeStyle
      markdownit={markdownItInstance}
      style={markdownStyle}
    >
      {processedContent}
    </Markdown>
  );
};

export default MarkdownView;
