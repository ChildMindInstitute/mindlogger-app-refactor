import { FC } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';

type IconProps = {
  color: string;
  size: number;
};

const CloseIcon: FC<IconProps> = ({ color, size }) => (
  <AntDesign name="close" color={color} size={size} />
);

export { CloseIcon };
