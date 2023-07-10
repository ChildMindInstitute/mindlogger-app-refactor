import { AnswerDto, AppletEncryptionDTO, UserActionDto } from '@app/shared/api';

export type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[];
  appletEncryption: AppletEncryptionDTO;
  itemIds: string[];
  flowId: string | null;
  activityId: string;
  executionGroupKey: string;
  userActions: UserActionDto[];
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userIdentifier?: string;
};
