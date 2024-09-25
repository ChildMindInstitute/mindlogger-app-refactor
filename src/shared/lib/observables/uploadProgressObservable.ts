import {
  IUploadProgressObservable,
  SecondLevelStep,
  UploadProgress,
} from './IUploadProgressObservable';
import { CommonObservable } from '../utils/observable';

export class UploadProgressObservable
  extends CommonObservable
  implements IUploadProgressObservable
{
  private uploadProgress: UploadProgress;

  constructor() {
    super();
    this.uploadProgress = {} as UploadProgress;
    this.reset();
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

  public set currentFile(value: number | null) {
    this.uploadProgress.currentFile = value;
    this.notify();
  }

  public async setTotalFilesInActivity(value: number | null) {
    this.uploadProgress.totalFilesInActivity = value;
    this.notify();
  }

  public async setCurrentSecondLevelStepKey(value: SecondLevelStep | null) {
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

  public reset() {
    this.uploadProgress.totalActivities = null;
    this.uploadProgress.currentActivity = null;
    this.uploadProgress.currentActivityName = null;
    this.uploadProgress.totalFilesInActivity = null;
    this.uploadProgress.currentFile = null;
    this.uploadProgress.currentSecondLevelStepKey = null;
  }
}
