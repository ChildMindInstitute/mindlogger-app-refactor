import { TouchInfo } from '@shopify/react-native-skia';

class TouchInfoMatrix {
  private matrix: Array<Array<TouchInfo>>;

  constructor(matrix: Array<Array<TouchInfo>>) {
    this.matrix = matrix;
  }

  filterOutMultiTouches(): Array<Array<TouchInfo>> {
    const firstTouchId = 0;

    return this.matrix.map(touchInfoList => {
      return touchInfoList.filter(touchInfo => touchInfo.id === firstTouchId);
    });
  }
}

export default TouchInfoMatrix;
