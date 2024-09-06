import 'react-native';

type Dimensions = {
  width: number;
  height: number;
};

type ImageDimensions = {
  getImageDimensionsSync(source: string): Dimensions | null;
};

declare module 'react-native' {
  interface NativeModulesStatic {
    ImageDimensions: ImageDimensions;
  }
}
