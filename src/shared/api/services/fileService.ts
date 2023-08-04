import { AxiosResponse } from 'axios';

import { IS_ANDROID } from '@app/shared/lib';

import httpService from './httpService';
import { SuccessfulResponse } from '../types';

type FileUploadRequest = {
  uri: string;
  fileName: string;
  type: string;
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
  }>;
};

type CheckIfLogsExistResponse = SuccessfulResponse<CheckIfLogsExistResultDto>;

function fileService() {
  return {
    async upload(
      request: FileUploadRequest,
      actionType: 'log' | 'regular' = 'regular',
    ) {
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
          },
        );
        return response;
      } catch (error) {
        console.error('error', JSON.stringify(error));
        throw error;
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
  };
}

export const FileService = fileService();
