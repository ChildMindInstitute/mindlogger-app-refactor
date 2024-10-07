import React from 'react';
import { requireNativeComponent, StyleProp, ViewStyle } from 'react-native';

type Props = {
  onLogResult: (event: { data: string; type: string }) => void;
  style: StyleProp<ViewStyle>;
};

type NativeFlankerProps = Props & {
  onEndGame: (e: any) => void;
};

const RNFlankerView = requireNativeComponent<NativeFlankerProps>('FlankerView');

export const SwiftFlankerWrapper: React.FC<Props> = props => {
  const _onEndGame = (event: any) => {
    if (!props.onLogResult) {
      return;
    }

    props.onLogResult(event.nativeEvent);
  };

  return <RNFlankerView {...props} onEndGame={_onEndGame} />;
};
