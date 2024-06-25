import { CommonObservable, wait } from '../utils';

type SecondLevelStep =
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

export interface IUploadProgressObservableSetters {
  set totalActivities(value: number | null);
  set currentActivity(value: number | null);
  set currentActivityName(value: string | null);
  set totalFilesInActivity(value: number | null);
  set currentFile(value: number | null);
  set currentSecondLevelStepKey(value: SecondLevelStep | null);
  delay(ms: number): Promise<void>;
  reset(): void;
}

class UploadProgressObservable
  extends CommonObservable
  implements IUploadProgressObservableSetters
{
  private uploadProgress: UploadProgress;

  constructor() {
    super();
    this.uploadProgress = {} as UploadProgress;
    this.reset();
  }
  set currentSecondLevelSteKey(value: SecondLevelStep | null) {
    throw new Error('Method not implemented.');
  }

  public set totalActivities(value: number | null) {
    this.uploadProgress.totalActivities = value;
  }

  public set currentActivity(value: number | null) {
    this.uploadProgress.currentActivity = value;
  }

  public set currentActivityName(value: string | null) {
    this.uploadProgress.currentActivityName = value;
  }

  public set totalFilesInActivity(value: number | null) {
    this.uploadProgress.totalFilesInActivity = value;
    this.notify();
  }

  public set currentFile(value: number | null) {
    this.uploadProgress.currentFile = value;
    this.notify();
  }

  public set currentSecondLevelStepKey(value: SecondLevelStep | null) {
    this.uploadProgress.currentSecondLevelStepKey = value;
    this.notify();
  }

  public get totalActivities() {
    return this.uploadProgress.totalActivities;
  }

  public get currentActivity() {
    return this.uploadProgress.currentActivity;
  }

  public get currentActivityName() {
    return this.uploadProgress.currentActivityName;
  }

  public get totalFilesInActivity() {
    return this.uploadProgress.totalFilesInActivity;
  }

  public get currentFile() {
    return this.uploadProgress.currentFile;
  }

  public get currentSecondLevelStepKey() {
    return this.uploadProgress.currentSecondLevelStepKey;
  }

  public async delay(ms: number) {
    await wait(ms);
  }

  public reset() {
    this.uploadProgress.totalActivities = null;
    this.uploadProgress.currentActivity = null;
    this.uploadProgress.currentActivityName = null;
    this.uploadProgress.totalFilesInActivity = null;
    this.uploadProgress.currentFile = null;
    this.uploadProgress.currentSecondLevelStepKey = null;
  }
}

export default new UploadProgressObservable();
