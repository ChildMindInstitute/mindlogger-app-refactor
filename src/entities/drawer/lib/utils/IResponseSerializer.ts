import { DrawLine } from '../types/draw';

export type IResponseSerializer = {
  process: (logLines: DrawLine[], width: number) => string;
};
