export interface IUploadObservable {
  set isLoading(value: boolean);
  set isError(value: boolean);
  set isPostponed(value: boolean);
  set isCompleted(value: boolean);
  reset(): void;
}
