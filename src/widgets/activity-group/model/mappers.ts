import { ActivityPipelineType } from '@app/abstract/lib/types/activityPipeline';
import {
  ActivityAssignment,
  ActivityFlowAssignment,
  Assignment,
  AssignmentParticipant,
} from '@app/entities/activity/lib/types/activityAssignment';
import { ActivityType } from '@app/entities/activity/lib/types/activityListItem';
import {
  ActivityFlowRecordDto,
  ActivityRecordDto,
  AssignmentDto,
  AssignmentParticipantDto,
} from '@app/shared/api/services/IAppletService';

import { Activity, ActivityFlow } from '../lib/types/activityGroupsBuilder';

export const mapActivitiesFromDto = (dtos: ActivityRecordDto[]): Activity[] => {
  return dtos.map(dto => ({
    description: dto.description,
    id: dto.id,
    image: dto.image,
    name: dto.name,
    isHidden: dto.isHidden,
    autoAssign: dto.autoAssign,
    order: dto.order,
    pipelineType: ActivityPipelineType.Regular,
    type: ActivityType.NotDefined,
  }));
};

export const mapActivityFlowsFromDto = (
  dtos: ActivityFlowRecordDto[],
): ActivityFlow[] => {
  return dtos.map(dto => ({
    activityIds: dto.activityIds,
    description: dto.description,
    hideBadge: dto.hideBadge,
    order: dto.order,
    id: dto.id,
    name: dto.name,
    isHidden: dto.isHidden,
    autoAssign: dto.autoAssign,
    pipelineType: ActivityPipelineType.Flow,
  }));
};

const mapAssignmentParticipantFromDto = (
  dto: AssignmentParticipantDto,
): AssignmentParticipant => {
  return {
    id: dto.id,
    userId: dto.userId,
    secretUserId: dto.secretUserId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    nickname: dto.nickname,
    tag: dto.tag,
    lastSeen: dto.lastSeen,
  };
};

export const mapAssignmentsFromDto = (dtos: AssignmentDto[]): Assignment[] => {
  const assignments: Assignment[] = [];

  for (const dto of dtos) {
    let assignment: Assignment | null = null;

    if (!!dto.activityId && !dto.activityFlowId) {
      assignment = {
        id: dto.id,
        __type: 'activity',
        activityId: dto.activityId,
        respondent: mapAssignmentParticipantFromDto(dto.respondentSubject),
        target: mapAssignmentParticipantFromDto(dto.targetSubject),
      } as ActivityAssignment;
    } else if (!dto.activityId && !!dto.activityFlowId) {
      assignment = {
        id: dto.id,
        __type: 'activityFlow',
        activityFlowId: dto.activityFlowId,
        respondent: mapAssignmentParticipantFromDto(dto.respondentSubject),
        target: mapAssignmentParticipantFromDto(dto.targetSubject),
      } as ActivityFlowAssignment;
    }

    if (assignment) {
      assignments.push(assignment);
    }
  }

  return assignments;
};
