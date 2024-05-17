export type MediaFile = {
  uri: string;
  type: string;
  fileName: string;
};

export type MediaValue = {
  size: number;
  fromLibrary: boolean;
} & MediaFile;
