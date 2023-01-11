import { FC } from 'react';
import { StyleSheet } from 'react-native';

import Markdown from 'react-native-markdown-display';

type Props = {
  content: string;
  markdownStyle: StyleSheet.NamedStyles<any>;
};

declare module 'react-native-markdown-display' {
  interface MarkdownProps {
    children: string;
  }
}

const MarkdownView: FC<Props> = ({ content, markdownStyle }) => {
  return <Markdown style={markdownStyle}>{content}</Markdown>;
};

export default MarkdownView;
