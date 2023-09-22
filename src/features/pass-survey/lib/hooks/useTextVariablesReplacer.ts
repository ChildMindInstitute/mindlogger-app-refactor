import { useSelector } from 'react-redux';

import { mapDtoToRespondentMeta } from '@app/entities/applet/model';
import { IdentityModel } from '@app/entities/identity';
import { useAppSelector } from '@app/shared/lib';
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
  const { data: respondentNickname } = useAppletDetailsQuery(appletId, {
    select: ({ data }) => mapDtoToRespondentMeta(data),
  });

  const userFirstName = useAppSelector(IdentityModel.selectors.selectFirstName);

  const lastResponseTime = completedEntities?.[activityId];

  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(
        items,
        answers,
        lastResponseTime,
        respondentNickname || userFirstName,
      );
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};

export { useTextVariablesReplacer };
