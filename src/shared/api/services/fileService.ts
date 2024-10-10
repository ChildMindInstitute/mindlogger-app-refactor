import { IS_ANDROID } from '@app/shared/lib/constants';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getStringHashCode } from '@app/shared/lib/utils/common';
import {
  watchForConnectionLoss,
  callApiWithRetry,
} from '@app/shared/lib/utils/networkHelpers';

import { getAxiosInstance, httpService } from './httpService';
import {
  AppletFileUploadToS3Request,
  AppletFileUploadToS3Response,
  CheckIfFilesExistRequest,
  CheckIfFilesExistResponse,
  CheckIfLogsExistRequest,
  CheckIfLogsExistResponse,
  FileUploadRequest,
  FileUploadResponse,
  GetFieldsForFileUploadRequest,
  GetFieldsForFileUploadResponse,
  IFileService,
} from './IFileService';

export function fileService(): IFileService {
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

          const deviceId = getDefaultSystemRecord().getDeviceId()!;

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
        const deviceId = getDefaultSystemRecord().getDeviceId()!;

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
          getDefaultLogger().error(
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
