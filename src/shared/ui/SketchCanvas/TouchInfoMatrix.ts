import { TouchInfo } from '@shopify/react-native-skia';

class TouchInfoMatrix {
  private rawMatrix: Array<Array<TouchInfo>>;

  constructor(rawMatrix: Array<Array<TouchInfo>>) {
    this.rawMatrix = rawMatrix;
  }

  public filterByTouchId(touchId: number): TouchInfoMatrix {
    const rawMatrix = this.rawMatrix.map(touchInfoList => {
      return touchInfoList.filter(touchInfo => touchInfo.id === touchId);
    });

    return new TouchInfoMatrix(rawMatrix);
  }

  public getValue(): Array<Array<TouchInfo>> {
    return this.rawMatrix;
  }
}

export default TouchInfoMatrix;
