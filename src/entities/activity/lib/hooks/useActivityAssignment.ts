import { useActivityAssignments } from './useActivityAssginments';
import { Assignment } from '../types/activityAssignment';

type UseActivityAssignmentOptions = {
  appletId: string;
  activityId: string | null;
  activityFlowId: string | null;
  targetSubjectId: string | null;
};

type UseActivityAssignmentValue = {
  assignment: Assignment | null;
};

export const useActivityAssignment = ({
  appletId,
  activityId,
  activityFlowId,
  targetSubjectId,
}: UseActivityAssignmentOptions): UseActivityAssignmentValue => {
  const { assignments } = useActivityAssignments({ appletId });

  let assignment: Assignment | null = null;
  if (activityFlowId) {
    // We must check for activity flow ID first because the type that some UI
    // component uses: `ActivityListAssignment`, has `flowId` and `activityId`
    // for activity flow items.
    assignment =
      assignments.find(
        _assignment =>
          _assignment.__type === 'activityFlow' &&
          _assignment.activityFlowId === activityFlowId &&
          _assignment.target.id === targetSubjectId,
      ) || null;
  } else if (activityId) {
    assignment =
      assignments.find(
        _assignment =>
          _assignment.__type === 'activity' &&
          _assignment.activityId === activityId &&
          _assignment.target.id === targetSubjectId,
      ) || null;
  } else {
    assignment = null;
  }

  return { assignment };
};
