export type AssignmentParticipant = {
  id: string;
  userId: string | null;
  secretUserId: string;
  firstName: string;
  lastName: string;
  nickname: string;
  tag: string;
  lastSeen: string | null;
};

type AssginmentBase = {
  id: string;
  __type: 'activity' | 'activityFlow';
  respondent: AssignmentParticipant;
  target: AssignmentParticipant;
};

export type ActivityAssignment = AssginmentBase & {
  __type: 'activity';
  activityId: string;
};

export type ActivityFlowAssignment = AssginmentBase & {
  __type: 'activityFlow';
  activityFlowId: string;
};

export type Assignment = ActivityAssignment | ActivityFlowAssignment;
