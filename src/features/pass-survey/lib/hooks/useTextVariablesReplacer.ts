import { useSelector } from 'react-redux';

import { AppletModel } from '@entities/applet';

import { Answers } from './useActivityStorageRecord';
import { MarkdownVariableReplacer } from '../markdownVariableReplacer';
import { PipelineItem } from '../types';

const useTextVariablesReplacer = ({
  items,
  answers,
  activityId,
}: {
  items: PipelineItem[] | undefined;
  answers: Answers | undefined;
  activityId: string;
}) => {
  const completedEntities = useSelector(
    AppletModel.selectors.selectCompletedEntities,
  );
  const lastResponseTime = completedEntities?.[activityId];
  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(
        items,
        answers,
        lastResponseTime,
      );
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};

export { useTextVariablesReplacer };
