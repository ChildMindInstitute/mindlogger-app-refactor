import React from 'react';
import { requireNativeComponent } from 'react-native';

type Props = {
  message: string;
  onClick: (event: any) => void;
  style: any;
  imageUrl: string;
};

const RCTFlankerSandboxView =
  requireNativeComponent<Props>('FlankerSandboxView');

export const MyNativeCustomView: React.FC<Props> = props => {
  const { message, onClick, style, imageUrl } = props;
  const _onClick = (event: any) => {
    if (!onClick) {
      return;
    }

    onClick(event.nativeEvent);
  };

  return (
    <RCTFlankerSandboxView
      imageUrl={imageUrl}
      message={message}
      onClick={_onClick}
      style={style}
    />
  );
};
