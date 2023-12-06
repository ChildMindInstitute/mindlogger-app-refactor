import {
  IS_ANDROID,
  Logger,
  callApiWithRetry,
  getStringHashCode,
  watchForConnectionLoss,
} from '@shared/lib';
import { SystemRecord } from '@shared/lib/records';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

type FileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
  fileId: string;
};

type AppletFileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
  fileId: string;
  appletId: string;
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

type CheckIfLogsExistRequest = {
  files: FileId[];
};

type CheckIfLogsExistResultDto = CheckIfFilesExistResultDto;

type CheckIfLogsExistResponse = SuccessfulResponse<CheckIfLogsExistResultDto>;

function fileService() {
  return {
    async upload(request: FileUploadRequest) {
      const { abortController, reset } = watchForConnectionLoss();

      try {
        const data = new FormData();
        const uri = IS_ANDROID
          ? request.uri
          : request.uri.replace('file://', '');

        data.append('file', {
          uri,
          name: request.fileName,
          type: request.type,
        } as unknown as Blob);

        const response = await httpService.post<FileUploadResponse>(
          '/file/upload',
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
    },

    async uploadLogFile(request: FileUploadRequest) {
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
    },

    async checkIfLogsExist(request: CheckIfLogsExistRequest) {
      const deviceId = SystemRecord.getDeviceId()!;

      const { abortController, reset } = watchForConnectionLoss();

      try {
        const response = await httpService.post<CheckIfLogsExistResponse>(
          `/file/log-file/${deviceId}/check`,
          request,
          {
            signal: abortController.signal,
          },
        );

        return response;
      } finally {
        reset();
      }
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

    async uploadAppletFile(request: AppletFileUploadRequest) {
      const apiCall = async () => {
        const { abortController, reset } = watchForConnectionLoss();

        try {
          const data = new FormData();
          const uri = IS_ANDROID
            ? request.uri
            : request.uri.replace('file://', '');

          data.append('file', {
            uri,
            name: request.fileName,
            type: request.type,
          } as unknown as Blob);

          const response = await httpService.post<FileUploadResponse>(
            `/file/${request.appletId}/upload`,
            data,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              signal: abortController.signal,
              params: { fileId: request.fileId },
            },
          );
          return response;
        } catch (error) {
          Logger.error(
            '[fileService.uploadAppletFile]: Error occurred: \n\n' + error,
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
