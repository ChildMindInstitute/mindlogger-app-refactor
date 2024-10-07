import { Assignment } from '../types/activityAssignment';

type UseActivityAssigneeOptions = {
  assignment: Assignment;
};

type UseActivityAssigneeValue = {
  shortName: string | null;
};

export const useActivityAssignee = ({
  assignment,
}: UseActivityAssigneeOptions): UseActivityAssigneeValue => {
  let shortName: string | null = null;
  if (assignment) {
    let targetLastInitial: string | null =
      `${assignment.target.lastName || ''}`.trim()[0] || null;
    if (targetLastInitial) {
      targetLastInitial = `${targetLastInitial}.`;
    }

    shortName = [assignment.target.firstName, targetLastInitial]
      .filter(name => `${name || ''}`.trim().length > 0)
      .join(' ');
  }

  return { shortName };
};
