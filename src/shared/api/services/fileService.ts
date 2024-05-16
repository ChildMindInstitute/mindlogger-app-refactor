import {
  IS_ANDROID,
  Logger,
  callApiWithRetry,
  getStringHashCode,
  watchForConnectionLoss,
} from '@shared/lib';
import { SystemRecord } from '@shared/lib/records';

import httpService, { getAxiosInstance } from './httpService';
import { SuccessfulResponse, SuccessfulEmptyResponse } from '../types';

type FileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
  fileId: string;
};

type UploadResultDto = {
  key: string;
  url: string;
  fileId: string;
};

type FileUploadResponse = SuccessfulResponse<UploadResultDto>;

type FileId = string;

type CheckIfFilesExistRequest = {
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

type CheckIfFilesExistResponse = SuccessfulResponse<CheckIfFilesExistResultDto>;

type GetFieldsForFileUploadRequest = {
  appletId: string;
  fileId: string;
};

type FieldsForFileUploadDto = {
  uploadUrl: string;
  url: string;
  fields: Record<string, string>;
};

type GetFieldsForFileUploadResponse =
  SuccessfulResponse<FieldsForFileUploadDto>;

type AppletFileUploadToS3Request = Omit<FieldsForFileUploadDto, 'url'> & {
  localUrl: string;
  fileName: string;
  type: string;
};

type AppletFileUploadToS3Response = SuccessfulEmptyResponse;

type CheckIfLogsExistRequest = {
  files: FileId[];
};

type CheckIfLogsExistResultDto = CheckIfFilesExistResultDto;

type CheckIfLogsExistResponse = SuccessfulResponse<CheckIfLogsExistResultDto>;

function fileService() {
  return {
    async uploadLogFile(request: FileUploadRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const data = new FormData();
          const uri = IS_ANDROID
            ? `file://${request.uri}`
            : request.uri.replace('file://', '');

          data.append('file', {
            uri,
            name: request.fileName,
            type: request.type,
          } as unknown as Blob);

          const deviceId = SystemRecord.getDeviceId()!;

          const hashedDeviceId: string = !deviceId
            ? 'undefined'
            : getStringHashCode(deviceId).toString();

          const response = await httpService.post<FileUploadResponse>(
            `/file/log-file/${hashedDeviceId}`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              signal: abortController.signal,
              params: { fileId: request.fileId },
            },
          );

          return response;
        } catch (error) {
          console.error('error', JSON.stringify(error));
          throw error;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },

    async checkIfLogsExist(request: CheckIfLogsExistRequest) {
      const apiCall = async () => {
        const deviceId = SystemRecord.getDeviceId()!;

        const hashedDeviceId: string = !deviceId
          ? 'undefined'
          : getStringHashCode(deviceId).toString();

        const { abortController, reset } = watchForConnectionLoss();

        try {
          const response = await httpService.post<CheckIfLogsExistResponse>(
            `/file/log-file/${hashedDeviceId}/check`,
            request,
            {
              signal: abortController.signal,
            },
          );

          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },

    async checkIfFilesExist(request: CheckIfFilesExistRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const response = await httpService.post<CheckIfFilesExistResponse>(
            `/file/${request.appletId}/upload/check`,
            request,
            {
              signal: abortController.signal,
            },
          );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },

    async getFieldsForFileUpload(request: GetFieldsForFileUploadRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const response =
            await httpService.post<GetFieldsForFileUploadResponse>(
              `/file/${request.appletId}/upload-url`,
              {
                fileId: request.fileId,
              },
              {
                signal: abortController.signal,
              },
            );
          return response;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },

    async uploadAppletFileToS3(request: AppletFileUploadToS3Request) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const data = new FormData();
          const localUrl = IS_ANDROID
            ? request.localUrl
            : request.localUrl.replace('file://', '');

          const fieldKeys = Object.keys(request.fields);

          for (const key of fieldKeys) {
            if (!request.fields[key]?.length) {
              continue;
            }
            data.append(key, request.fields[key]);
          }

          data.append('file', {
            uri: localUrl,
            name: request.fileName,
            type: request.type,
          } as unknown as Blob);

          const httpInstance = getAxiosInstance();

          const response =
            await httpInstance.post<AppletFileUploadToS3Response>(
              request.uploadUrl,
              data,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
                signal: abortController.signal,
              },
            );
          return response;
        } catch (error) {
          Logger.error(
            '[fileService.uploadAppletFileToS3]: Error occurred: \n\n' + error,
          );
          throw error;
        } finally {
          reset();
        }
      };

      return callApiWithRetry(apiCall);
    },
  };
}

export const FileService = fileService();
