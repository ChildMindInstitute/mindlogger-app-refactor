import { MediaFile } from '@shared/ui/survey/MediaItems/types.ts';

export const enum UnityType {}

export type UnityResult = {
  responseType: 'unity';
  startTime: number;
  taskData: MediaFile[];
};
