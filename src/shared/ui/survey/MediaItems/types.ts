export type MediaFile = {
  type: string;
  fileName: string;
};

export type MediaValue = {
  size: number;
  fromLibrary: boolean;
} & MediaFile;
