import { EntityProgression } from '@app/abstract/lib';
import { useAppSelector } from '@app/shared/lib';

import { selectAppletsEntityProgressions } from '../selectors';

type UseInProgressRecordInput = {
  appletId: string;
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

const useInProgressRecord = ({
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

export default useInProgressRecord;
