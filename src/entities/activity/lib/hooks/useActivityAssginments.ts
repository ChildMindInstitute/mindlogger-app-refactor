import { useQueryClient } from '@tanstack/react-query';

import { AppletAssignmentsResponse } from '@app/shared/api/services/IAppletService';
import {
  getDataFromQuery,
  getAssignmentsKey,
} from '@app/shared/lib/utils/reactQueryHelpers';
import { mapAssignmentsFromDto } from '@app/widgets/activity-group/model/mappers';

import { Assignment } from '../types/activityAssignment';

type UseActivityAssignmentsOptions = {
  appletId: string;
};

type UseActivityAssignmentsValue = {
  assignments: Assignment[];
};

export const useActivityAssignments = ({
  appletId,
}: UseActivityAssignmentsOptions): UseActivityAssignmentsValue => {
  const queryClient = useQueryClient();

  const assignmentsResponse = getDataFromQuery<AppletAssignmentsResponse>(
    getAssignmentsKey(appletId),
    queryClient,
  );
  if (!assignmentsResponse) {
    return { assignments: [] };
  }

  const assignments = mapAssignmentsFromDto(
    assignmentsResponse.result.assignments,
  );

  return { assignments };
};
