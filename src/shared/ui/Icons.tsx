import { FC } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';

type IconProps = {
  color: string;
  size: number;
};

export const CloseIcon: FC<IconProps> = props => (
  <AntDesign name="close" {...props} />
);

export const ArrowRightIcon: FC<IconProps> = props => (
  <AntDesign name="arrowright" {...props} />
);

export const KeyIcon: FC<IconProps> = props => (
  <Foundation name="key" {...props} />
);

export const UserIcon: FC<IconProps> = props => (
  <FontAwesome name="user-circle" {...props} />
);
