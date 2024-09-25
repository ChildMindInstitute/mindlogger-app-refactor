import { fileService } from './fileService';

let instance: ReturnType<typeof fileService>;
export const getDefaultFileService = () => {
  if (!instance) {
    instance = fileService();
  }
  return instance;
};
