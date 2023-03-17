import React from 'react';
import { requireNativeComponent, StyleProp, ViewStyle } from 'react-native';

type Props = {
  onLogResult: (event: { data: string; type: string }) => void;
  style: StyleProp<ViewStyle>;
};

const RNFlankerView = requireNativeComponent('FlankerView');

const FlankerViewWrapper: React.FC<Props> = props => {
  const _onEndGame = (event: any) => {
    if (!props.onLogResult) {
      return;
    }

    props.onLogResult(event.nativeEvent);
  };

  return <RNFlankerView {...props} onEndGame={_onEndGame} />;
};

export default FlankerViewWrapper;
