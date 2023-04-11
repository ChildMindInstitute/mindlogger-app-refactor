import { MarkdownVariableReplacer } from '@shared/lib/utils/survey';

import { Answers } from './useActivityStorageRecord';
import { PipelineItem } from '../types';

const useTextVariablesReplacer = ({
  items,
  answers,
}: {
  items: PipelineItem[] | undefined;
  answers: Answers | undefined;
}) => {
  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(items, answers);
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};

export { useTextVariablesReplacer };
