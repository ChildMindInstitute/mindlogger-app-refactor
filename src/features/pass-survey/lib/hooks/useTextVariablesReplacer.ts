import { useSelector } from 'react-redux';

import { AppletModel, useAppletDetailsQuery } from '@entities/applet';

import { Answers } from './useActivityStorageRecord';
import { MarkdownVariableReplacer } from '../markdownVariableReplacer';
import { PipelineItem } from '../types';

const useTextVariablesReplacer = ({
  items,
  answers,
  activityId,
  appletId,
}: {
  items: PipelineItem[] | undefined;
  answers: Answers | undefined;
  activityId: string;
  appletId: string;
}) => {
  const completedEntities = useSelector(
    AppletModel.selectors.selectCompletedEntities,
  );
  const respondentNickname = useAppletDetailsQuery(appletId, {
    select: r => r.data.respondentMeta.nickname,
  });

  const lastResponseTime = completedEntities?.[activityId];
  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(
        items,
        answers,
        lastResponseTime,
        respondentNickname.data,
      );
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};

export { useTextVariablesReplacer };
