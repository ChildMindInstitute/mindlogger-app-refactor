import { useSelector } from 'react-redux';

import { useAppletDetailsQuery } from '@app/entities/applet/api/hooks/useAppletDetailsQuery';
import { mapDtoToRespondentMeta } from '@app/entities/applet/model/mappers';
import { selectEntityResponseTimes } from '@app/entities/applet/model/selectors';
import { selectFirstName } from '@app/entities/identity/model/selectors';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { Answers } from './useActivityStorageRecord';
import { MarkdownVariableReplacer } from '../markdownVariableReplacer';
import { PipelineItem } from '../types/payload';

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
  const entityResponseTimes = useSelector(selectEntityResponseTimes);

  const { data: respondentNickname } = useAppletDetailsQuery(appletId, {
    select: ({ data }) => mapDtoToRespondentMeta(data),
  });

  const userFirstName = useAppSelector(selectFirstName);

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
