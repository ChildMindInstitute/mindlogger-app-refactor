import { AxiosResponse } from 'axios';

import { IS_ANDROID, watchForConnectionLoss } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

type FileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
  fileId: string;
};

type UploadResultDto = {
  key: string;
  url: string;
};

type FileUploadResponse = SuccessfulResponse<UploadResultDto>;

type CheckIfLogsExistRequest = {
  filesToCheck: Array<string>;
};

type CheckIfLogsExistResultDto = {
  files: Array<{
    fileName: string;
    exists: boolean;
    size: number;
  }>;
};

type CheckIfLogsExistResponse = SuccessfulResponse<CheckIfLogsExistResultDto>;

type FileId = string;

type CheckIfFilesExistRequest = {
  files: FileId[];
};

export type CheckIfFilesExistResultDto = Array<{
  key: string;
  uploaded: boolean;
  url: string | null;
}>;

type CheckIfFilesExistResponse = SuccessfulResponse<CheckIfFilesExistResultDto>;

function fileService() {
  return {
    async upload(
      request: FileUploadRequest,
      actionType: 'log' | 'regular' = 'regular',
    ) {
      if (actionType === 'log') {
        // todo
        return Promise.resolve<AxiosResponse<FileUploadResponse, any>>({
          status: 200,
        } as AxiosResponse<FileUploadResponse, any>);
      }

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
          actionType === 'regular' ? '/file/upload' : '/log-file/upload',
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
      // todo, fake response is here now

      return Promise.resolve<AxiosResponse<CheckIfLogsExistResponse, any>>({
        status: 200,
        data: {
          result: {
            files: request.filesToCheck.map(x => ({
              fileName: x,
              exists: false,
            })),
          },
        },
      } as AxiosResponse<CheckIfLogsExistResponse, any>);
    },

    async checkIfFilesExist(request: CheckIfFilesExistRequest) {
      const { abortController, reset } = watchForConnectionLoss();

      try {
        const response = await httpService.post<CheckIfFilesExistResponse>(
          '/file/upload/check',
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
  };
}

export const FileService = fileService();
