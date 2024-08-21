import React, { FC, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import markdownContainer from 'markdown-it-container';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';

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
  rules?: any;
};

const MarkdownView: FC<Props> = ({ content, markdownStyle, rules }) => {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    preprocessImageLinks(content).then(result => {
      setProcessedContent(result);
    });
  }, [content]);

  return (
    <Markdown
      markdownit={markdownItInstance}
      style={markdownStyle}
      rules={rules}
    >
      {processedContent}
    </Markdown>
  );
};

export default MarkdownView;
