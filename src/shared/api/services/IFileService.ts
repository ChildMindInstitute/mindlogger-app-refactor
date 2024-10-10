import { AxiosResponse } from 'axios';

import { SuccessfulResponse, SuccessfulEmptyResponse } from '../types';

export type FileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
  fileId: string;
};

export type UploadResultDto = {
  key: string;
  url: string;
  fileId: string;
};

export type FileUploadResponse = SuccessfulResponse<UploadResultDto>;

type FileId = string;

export type CheckIfFilesExistRequest = {
  files: FileId[];
  appletId: string;
};

export type CheckIfFilesExistResultDto = Array<{
  key: string;
  fileId: string;
  uploaded: boolean;
  url: string | null;
  fileSize?: number | null;
}>;

export type CheckIfFilesExistResponse =
  SuccessfulResponse<CheckIfFilesExistResultDto>;

export type GetFieldsForFileUploadRequest = {
  appletId: string;
  fileId: string;
};

export type FieldsForFileUploadDto = {
  uploadUrl: string;
  url: string;
  fields: Record<string, string>;
};

export type GetFieldsForFileUploadResponse =
  SuccessfulResponse<FieldsForFileUploadDto>;

export type AppletFileUploadToS3Request = Omit<
  FieldsForFileUploadDto,
  'url'
> & {
  localUrl: string;
  fileName: string;
  type: string;
};

export type AppletFileUploadToS3Response = SuccessfulEmptyResponse;

export type CheckIfLogsExistRequest = {
  files: FileId[];
};

export type CheckIfLogsExistResultDto = CheckIfFilesExistResultDto;

export type CheckIfLogsExistResponse =
  SuccessfulResponse<CheckIfLogsExistResultDto>;

export interface IFileService {
  uploadLogFile: (
    request: FileUploadRequest,
  ) => Promise<AxiosResponse<FileUploadResponse>>;
  checkIfLogsExist: (
    request: CheckIfLogsExistRequest,
  ) => Promise<AxiosResponse<CheckIfLogsExistResponse>>;
  checkIfFilesExist: (
    request: CheckIfFilesExistRequest,
  ) => Promise<AxiosResponse<CheckIfFilesExistResponse>>;
  getFieldsForFileUpload: (
    request: GetFieldsForFileUploadRequest,
  ) => Promise<AxiosResponse<GetFieldsForFileUploadResponse>>;
  uploadAppletFileToS3: (
    request: AppletFileUploadToS3Request,
  ) => Promise<AxiosResponse<AppletFileUploadToS3Response>>;
}
