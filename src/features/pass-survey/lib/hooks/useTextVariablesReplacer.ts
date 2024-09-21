import { useSelector } from 'react-redux';

import { mapDtoToRespondentMeta } from '@app/entities/applet/model';
import { IdentityModel } from '@app/entities/identity';
import { useAppSelector } from '@app/shared/lib';
import { AppletModel, useAppletDetailsQuery } from '@entities/applet';

import { Answers } from './useActivityStorageRecord';
import { MarkdownVariableReplacer } from '../markdownVariableReplacer';
import { PipelineItem } from '../types';

type UseTextVariablesReplacerOptions = {
  appletId: string;
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
  items: PipelineItem[] | undefined;
  answers: Answers | undefined;
};

const useTextVariablesReplacer = ({
  appletId,
  activityId,
  eventId,
  targetSubjectId,
  items,
  answers,
}: UseTextVariablesReplacerOptions) => {
  const entityResponseTimes = useSelector(
    AppletModel.selectors.selectEntityResponseTimes,
  );

  const { data: respondentNickname } = useAppletDetailsQuery(appletId, {
    select: ({ data }) => mapDtoToRespondentMeta(data),
  });

  const userFirstName = useAppSelector(IdentityModel.selectors.selectFirstName);

  const lastResponseTime = entityResponseTimes
    ?.filter(
      record =>
        record.entityId === activityId &&
        record.eventId === eventId &&
        record.targetSubjectId === targetSubjectId,
    )
    .sort(
      ({ responseTime: responseTimeA }, { responseTime: responseTimeB }) => {
        return responseTimeB - responseTimeA;
      },
    )[0]?.responseTime;

  const replaceTextVariables = (text: string) => {
    if (items && answers) {
      const replacer = new MarkdownVariableReplacer(
        items,
        answers,
        lastResponseTime || null,
        respondentNickname || userFirstName,
      );
      return replacer.process(text);
    }
    return text;
  };

  return { replaceTextVariables };
};

export { useTextVariablesReplacer };
