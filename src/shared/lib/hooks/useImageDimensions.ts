import { useImageDimensions as useImageDimensionsBase } from '@react-native-community/hooks';

export type ImageDimensions = {
  width: number;
  height: number;
  aspectRatio: number;
};

type UseImageDimensionsReturn = {
  dimensions: ImageDimensions | null;
  isLoading: boolean;
};

export function useImageDimensions(
  url: string | null,
): UseImageDimensionsReturn {
  const result = useImageDimensionsBase({ uri: url ?? '' });

  if (result.error) {
    return { dimensions: null, isLoading: false };
  }

  return {
    dimensions: result.dimensions ?? null,
    isLoading: result.loading,
  };
}
