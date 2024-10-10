import { EntityProgression } from '@app/abstract/lib/types/entityProgress';
import { useAppSelector } from '@app/shared/lib/hooks/redux';

import { selectAppletsEntityProgressions } from '../selectors';

type UseInProgressRecordInput = {
  appletId: string;
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export const useInProgressRecord = ({
  appletId,
  entityId,
  eventId,
  targetSubjectId,
}: UseInProgressRecordInput): EntityProgression | null => {
  const entityProgressions = useAppSelector(selectAppletsEntityProgressions);

  return (
    entityProgressions.find(progression => {
      return (
        progression.appletId === appletId &&
        progression.entityId === entityId &&
        progression.eventId === eventId &&
        progression.targetSubjectId === targetSubjectId
      );
    }) || null
  );
};
