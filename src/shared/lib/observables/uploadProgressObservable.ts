import { CommonObservable } from '../utils';

type SecondLevelStep = 'upload_files' | 'encrypt_answers' | 'upload_answers';

export interface IUploadProgressObservableSetters {
  set totalActivities(value: number);
  set currentActivity(value: number);
  set currentActivityName(value: string);
  set totalFilesInActivity(value: number);
  set currentFile(value: number);
  set currentSecondLevelStep(value: SecondLevelStep | null);
  reset(): void;
}

class UploadProgressObservable
  extends CommonObservable
  implements IUploadProgressObservableSetters
{
  private _totalActivities: number = -1;

  private _currentActivity: number = -1; // zero-based

  private _currentActivityName: string = '';

  private _totalFilesInActivity: number = -1;

  private _currentFile: number = -1; // zero-based

  private _currentSecondLevelStep: SecondLevelStep | null = null;

  constructor() {
    super();
  }

  public set totalActivities(value: number) {
    this._totalActivities = value;
  }

  public set currentActivity(value: number) {
    this._currentActivity = value;
  }

  public set currentActivityName(value: string) {
    this._currentActivityName = value;
  }

  public set totalFilesInActivity(value: number) {
    this._totalFilesInActivity = value;
    this.notify();
  }

  public set currentFile(value: number) {
    this._currentFile = value;
    this.notify();
  }

  public set currentSecondLevelStep(value: SecondLevelStep | null) {
    this._currentSecondLevelStep = value;
    this.notify();
  }

  public get totalActivities() {
    return this._totalActivities;
  }

  public get currentActivity() {
    return this._currentActivity;
  }

  public get currentActivityName() {
    return this._currentActivityName;
  }

  public get totalFilesInActivity() {
    return this._totalFilesInActivity;
  }

  public get currentFile() {
    return this._currentFile;
  }

  public get currentSecondLevelStep() {
    return this._currentSecondLevelStep;
  }

  public reset() {
    this._totalActivities = -1;
    this._currentActivity = -1;
    this._currentActivityName = '';
    this._totalFilesInActivity = -1;
    this._currentFile = -1;
    this._currentSecondLevelStep = null;
  }
}

export default new UploadProgressObservable();
