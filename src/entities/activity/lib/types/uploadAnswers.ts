import { AnswerDto, AppletEncryptionDTO, UserActionDto } from '@app/shared/api';

export type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[]; // ?
  appletEncryption: AppletEncryptionDTO;
  itemIds: string[]; // ?
  flowId: string | null;
  activityId: string;
  executionGroupKey: string;
  userActions: UserActionDto[];
  scheduledTime?: number;
  startTime: number;
  endTime: number;
  userIdentifier?: string;
  debug_activityName?: string;
  debug_completedAt?: string;
};

export type CheckFileUploadResult = {
  fileId: string;
  uploaded: boolean;
  remoteUrl: string | null;
};

export type CheckFilesUploadResults = Array<CheckFileUploadResult>;

export type CheckAnswersInput = {
  appletId: string;
  createdAt: number;
  activityId: string;
  flowId: string | null;
};
