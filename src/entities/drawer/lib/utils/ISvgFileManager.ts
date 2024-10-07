export type SvgFileMeta = {
  fileName: string;
  type: 'image/svg';
  uri: string;
};

export interface ISvgFileManager {
  getFileMeta(fileName: string | null): SvgFileMeta;
  writeFile(filePath: string, svg: string): Promise<void>;
}
