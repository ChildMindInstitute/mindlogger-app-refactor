import {
  AnswerAlertsDto,
  AnswerDto,
  UserActionDto,
} from '@app/shared/api/services/IAnswerService';
import { AppletEncryptionDTO } from '@app/shared/api/services/IAppletService';

export type SendAnswersInput = {
  appletId: string;
  version: string;
  createdAt: number;
  answers: AnswerDto[];
  appletEncryption: AppletEncryptionDTO;
  itemIds: string[];
  flowId: string | null;
  activityId: string;
  submitId: string;
  userActions: UserActionDto[];
  scheduledTime: number | null;
  startTime: number;
  endTime: number;
  userIdentifier?: string;
  eventId: string;
  targetSubjectId: string | null;
  isFlowCompleted: boolean;
  client: {
    appId: string;
    appVersion: string;
    width: number;
    height: number;
  };
  alerts: AnswerAlertsDto;
  tzOffset: number;
  activityName: string;
  logCompletedAt?: string;
  consentToShare?: boolean;
  eventVersion?: string;
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
  submitId: string;
};
