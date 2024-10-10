export type SecondLevelStep =
  | 'upload_files'
  | 'encrypt_answers'
  | 'upload_answers'
  | 'completed';

export type UploadProgress = {
  totalActivities: number | null;
  currentActivity: number | null;
  currentActivityName: string | null;
  totalFilesInActivity: number | null;
  currentFile: number | null;
  currentSecondLevelStepKey: SecondLevelStep | null;
};

export interface IUploadProgressObservable {
  set totalActivities(value: number | null);
  set currentActivity(value: number | null);
  set currentActivityName(value: string | null);
  set currentFile(value: number | null);
  setTotalFilesInActivity(value: number | null): Promise<void>;
  setCurrentSecondLevelStepKey(value: SecondLevelStep | null): Promise<void>;
  reset(): void;
}
