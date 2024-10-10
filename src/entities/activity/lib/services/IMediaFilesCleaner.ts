import { ActivityRecordKeyParams } from '@app/abstract/lib/types/storage';
import { AnswerDto } from '@app/shared/api/services/IAnswerService';

export type IMediaFilesCleaner = {
  cleanUp: (keyParams: ActivityRecordKeyParams) => void;
  cleanUpByStorageKey: (key: string) => void;
  cleanUpByAnswers: (answers: AnswerDto[]) => void;
};
