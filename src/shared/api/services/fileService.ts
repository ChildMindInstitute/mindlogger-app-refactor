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

function fileService() {
  return {
    async upload(request: FileUploadRequest) {
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

        return httpService.post<FileUploadResponse>('/file/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (error) {
        console.error(error);
      }
    },
  };
}

export const FileService = fileService();
