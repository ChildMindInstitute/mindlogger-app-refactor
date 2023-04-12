import { StoreProgressPayload } from '@app/abstract/lib';
import { useAppSelector } from '@app/shared/lib';

import { selectInProgressApplets } from '../selectors';

type UseInProgressRecordInput = {
  appletId: string;
  entityId: string;
  eventId: string;
};

const useInProgressRecord = ({
  appletId,
  entityId,
  eventId,
}: UseInProgressRecordInput): StoreProgressPayload | null => {
  const inProgressApplets = useAppSelector(selectInProgressApplets);

  const record = inProgressApplets[appletId]?.[entityId]?.[eventId] ?? null;

  return record;
};

export default useInProgressRecord;
